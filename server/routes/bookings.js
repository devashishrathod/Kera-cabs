const express = require("express");
const router = express.Router();

const { isAdmin, verifyJwtToken } = require("../middlewares");
const {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings");

router.post("/create", isAdmin, createBooking);
router.get("/getAll", verifyJwtToken, getAllBookings);
router.get("/get/:id", verifyJwtToken, getBooking);
router.put("/update/:id", isAdmin, updateBooking);
router.delete("/delete/:id", isAdmin, deleteBooking);

module.exports = router;
