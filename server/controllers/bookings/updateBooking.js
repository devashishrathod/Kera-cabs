const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateBookingById } = require("../../services/bookings");
const { validateUpdateBooking } = require("../../validator/bookings");

exports.updateBooking = asyncWrapper(async (req, res) => {
  const { error } = validateUpdateBooking(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const updated = await updateBookingById(req.params?.id, req.body);
  return sendSuccess(res, 200, "Booking updated successfully", updated);
});
