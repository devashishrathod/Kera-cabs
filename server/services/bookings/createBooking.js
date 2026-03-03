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

exports.createBooking = async (payload) => {
  let { companyId, categoryId, userId, startDate, endDate, status, price } =
    payload;

  validateObjectId(companyId, "Company Id");
  validateObjectId(categoryId, "Category Id");
  validateObjectId(userId, "User Id");

  const company = await Company.findOne({ _id: companyId, isDeleted: false });
  if (!company) throwError(404, "Company not found");

  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });
  if (!category) throwError(404, "Category not found");

  const user = await User.findOne({ _id: userId, isDeleted: false });
  if (!user) throwError(404, "User not found");

  const now = new Date();
  const today = normalizeStartOfDay(now);

  startDate = startDate ? new Date(startDate) : today;
  if (Number.isNaN(startDate.getTime())) throwError(422, "Invalid startDate");

  endDate = new Date(endDate);
  if (Number.isNaN(endDate.getTime())) throwError(422, "Invalid endDate");

  const start = normalizeStartOfDay(startDate);
  const end = normalizeEndOfDay(endDate);

  if (start.getTime() > today.getTime()) {
    throwError(400, "Start date cannot be a future date");
  }

  if (end.getTime() < start.getTime()) {
    throwError(400, "End date must be greater than or equal to start date");
  }

  const noOfDays = diffDays(start, end);

  const overlap = await Booking.findOne({
    userId,
    isDeleted: false,
    status: { $ne: "cancelled" },
    startDate: { $lte: end },
    endDate: { $gte: start },
  });

  if (overlap) {
    throwError(
      409,
      "User already has another booking that overlaps with the selected date range",
    );
  }

  return await Booking.create({
    companyId,
    categoryId,
    userId,
    startDate: start,
    endDate: end,
    status: status || "pending",
    noOfDays,
    price,
  });
};
