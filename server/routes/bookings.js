const express = require("express");
const router = express.Router();

const { isAdminOrStaff, verifyJwtToken } = require("../middlewares");
const {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings");

router.post("/create", isAdminOrStaff, createBooking);
router.get("/getAll", isAdminOrStaff, getAllBookings);
router.get("/get/:id", isAdminOrStaff, getBooking);
router.put("/update/:id", isAdminOrStaff, updateBooking);
router.delete("/delete/:id", isAdminOrStaff, deleteBooking);

module.exports = router;
