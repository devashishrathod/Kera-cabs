const Booking = require("../../models/Booking");
const { throwError, validateObjectId } = require("../../utils");

exports.deleteBookingById = async (id) => {
  validateObjectId(id, "Booking Id");
  const booking = await Booking.findById(id);
  if (!booking || booking.isDeleted) throwError(404, "Booking not found");

  booking.isDeleted = true;
  booking.updatedAt = new Date();
  await booking.save();
  return;
};
