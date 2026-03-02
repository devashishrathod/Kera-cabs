const { createBooking } = require("./createBooking");
const { getBookingById } = require("./getBookingById");
const { getAllBookings } = require("./getAllBookings");
const { updateBookingById } = require("./updateBookingById");
const { deleteBookingById } = require("./deleteBookingById");

module.exports = {
  createBooking,
  getBookingById,
  getAllBookings,
  updateBookingById,
  deleteBookingById,
};
