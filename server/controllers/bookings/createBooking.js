const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createBooking } = require("../../services/bookings");
const { validateCreateBooking } = require("../../validator/bookings");

exports.createBooking = asyncWrapper(async (req, res) => {
  const { error } = validateCreateBooking(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const booking = await createBooking(req.body);
  return sendSuccess(res, 201, "Booking created successfully", booking);
});
