const { asyncWrapper, sendSuccess } = require("../../utils");
const { getBookingById } = require("../../services/bookings");

exports.getBooking = asyncWrapper(async (req, res) => {
  const booking = await getBookingById(req.params?.id);
  return sendSuccess(res, 200, "Booking fetched", booking);
});
