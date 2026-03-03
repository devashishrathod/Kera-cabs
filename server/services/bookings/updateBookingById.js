const Booking = require("../../models/Booking");
const Company = require("../../models/Company");
const Category = require("../../models/Category");
const User = require("../../models/User");
const { throwError, validateObjectId } = require("../../utils");

const normalizeStartOfDay = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const normalizeEndOfDay = (d) => {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
};

const diffDays = (start, end) => {
  const ms =
    normalizeStartOfDay(end).getTime() - normalizeStartOfDay(start).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
};

exports.updateBookingById = async (id, payload = 0) => {
  validateObjectId(id, "Booking Id");
  const booking = await Booking.findById(id);
  if (!booking || booking.isDeleted) throwError(404, "Booking not found");

  if (!payload) return booking;

  let { companyId, categoryId, userId, startDate, endDate, status, price } =
    payload;

  if (companyId) {
    validateObjectId(companyId, "Company Id");
    const company = await Company.findOne({ _id: companyId, isDeleted: false });
    if (!company) throwError(404, "Company not found");
    booking.companyId = companyId;
  }

  if (categoryId) {
    validateObjectId(categoryId, "Category Id");
    const category = await Category.findOne({
      _id: categoryId,
      isDeleted: false,
    });
    if (!category) throwError(404, "Category not found");
    booking.categoryId = categoryId;
  }

  if (userId) {
    validateObjectId(userId, "User Id");
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) throwError(404, "User not found");
    booking.userId = userId;
  }

  const now = new Date();
  const today = normalizeStartOfDay(now);

  let start = booking.startDate;
  let end = booking.endDate;

  if (startDate) {
    const s = new Date(startDate);
    if (Number.isNaN(s.getTime())) throwError(422, "Invalid startDate");
    start = normalizeStartOfDay(s);
  }

  if (endDate) {
    const e = new Date(endDate);
    if (Number.isNaN(e.getTime())) throwError(422, "Invalid endDate");
    end = normalizeEndOfDay(e);
  }

  if (start) {
    if (normalizeStartOfDay(start).getTime() > today.getTime()) {
      throwError(400, "Start date cannot be a future date");
    }
  }

  if (normalizeEndOfDay(end).getTime() < normalizeStartOfDay(start).getTime()) {
    throwError(400, "End date must be greater than or equal to start date");
  }

  const overlap = await Booking.findOne({
    _id: { $ne: id },
    userId: booking.userId,
    isDeleted: false,
    status: { $ne: "cancelled" },
    startDate: { $lte: normalizeEndOfDay(end) },
    endDate: { $gte: normalizeStartOfDay(start) },
  });

  if (overlap) {
    throwError(
      409,
      "User already has another booking that overlaps with the selected date range",
    );
  }

  booking.startDate = normalizeStartOfDay(start);
  booking.endDate = normalizeEndOfDay(end);
  booking.noOfDays = diffDays(booking.startDate, booking.endDate);

  if (status) booking.status = status;
  if (typeof price !== "undefined") booking.price = price;

  booking.updatedAt = new Date();
  await booking.save();
  return booking;
};
