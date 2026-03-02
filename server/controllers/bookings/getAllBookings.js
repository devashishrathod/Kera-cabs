const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllBookings } = require("../../services/bookings");
const { validateGetAllBookingsQuery } = require("../../validator/bookings");

exports.getAllBookings = asyncWrapper(async (req, res) => {
  const { error } = validateGetAllBookingsQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllBookings(req.query);
  return sendSuccess(res, 200, "Bookings fetched successfully", result);
});
