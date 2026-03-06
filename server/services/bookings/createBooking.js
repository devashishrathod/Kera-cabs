const Booking = require("../../models/Booking");
const Company = require("../../models/Company");
const Category = require("../../models/Category");
const User = require("../../models/User");
const { throwError, validateObjectId } = require("../../utils");
const { BOOKING_STATUS } = require("../../constants");

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
  const startMs = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
  );
  const endMs = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
  );
  return Math.floor((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;
};

const isYMD = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

const localYMD = (d) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const ymdToUTCStart = (ymd) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
};

const ymdToUTCEnd = (ymd) => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
};

exports.createBooking = async (payload, bookedByUserId) => {
  let { companyId, categoryId, userId, startDate, endDate, status, price } =
    payload;

  validateObjectId(companyId, "Company Id");
  validateObjectId(categoryId, "Category Id");
  validateObjectId(userId, "User Id");
  validateObjectId(bookedByUserId, "BookedBy User Id");

  const company = await Company.findOne({ _id: companyId, isDeleted: false });
  if (!company) throwError(404, "Company not found");

  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });
  if (!category) throwError(404, "Category not found");

  const user = await User.findOne({ _id: userId, isDeleted: false });
  if (!user) throwError(404, "User not found");

  const bookedBy = await User.findOne({
    _id: bookedByUserId,
    isDeleted: false,
  });
  if (!bookedBy) throwError(404, "BookedBy user not found");

  const todayYMD = localYMD(new Date());

  const startYMD = startDate
    ? isYMD(startDate)
      ? startDate
      : localYMD(startDate)
    : todayYMD;
  if (!startYMD) throwError(422, "Invalid startDate");

  const endYMD = endDate
    ? isYMD(endDate)
      ? endDate
      : localYMD(endDate)
    : null;
  if (!endYMD) throwError(422, "Invalid endDate");

  const start = ymdToUTCStart(startYMD);
  const end = ymdToUTCEnd(endYMD);

  if (startYMD < todayYMD) throwError(400, "Start date cannot be a past date");

  if (end.getTime() < start.getTime()) {
    throwError(400, "End date must be greater than or equal to start date");
  }

  const noOfDays = diffDays(start, end);

  // const overlap = await Booking.findOne({
  //   userId,
  //   isDeleted: false,
  //   status: { $ne: "cancelled" },
  //   startDate: { $lte: end },
  //   endDate: { $gte: start },
  // });

  // if (overlap) {
  //   throwError(
  //     409,
  //     "User already has another booking that overlaps with the selected date range",
  //   );
  // }

  return await Booking.create({
    companyId,
    categoryId,
    userId,
    bookedBy: bookedByUserId,
    startDate: start,
    endDate: end,
    status: status || BOOKING_STATUS.PENDING,
    noOfDays,
    price,
  });
};
