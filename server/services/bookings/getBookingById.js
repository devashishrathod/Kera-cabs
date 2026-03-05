const Booking = require("../../models/Booking");
const { throwError, validateObjectId } = require("../../utils");

exports.getBookingById = async (id) => {
  validateObjectId(id, "Booking Id");
  const booking = await Booking.findOne({ _id: id, isDeleted: false })
    .populate("companyId")
    .populate("categoryId")
    .populate("userId")
    .populate("bookedBy");

  if (!booking) throwError(404, "Booking not found");
  return booking;
};
