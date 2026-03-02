const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteBookingById } = require("../../services/bookings");

exports.deleteBooking = asyncWrapper(async (req, res) => {
  await deleteBookingById(req.params?.id);
  return sendSuccess(res, 200, "Booking deleted successfully");
});
