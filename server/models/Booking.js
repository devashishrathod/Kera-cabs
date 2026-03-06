const mongoose = require("mongoose");
const { companyField, categoryField, userField } = require("./validObjectId");
const { BOOKING_STATUS } = require("../constants");

const bookingSchema = new mongoose.Schema(
  {
    companyId: { ...companyField },
    categoryId: { ...categoryField },
    userId: { ...userField, required: true },
    bookedBy: { ...userField, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: [...Object.values(BOOKING_STATUS)],
      default: BOOKING_STATUS.PENDING,
    },
    noOfDays: { type: Number, required: true },
    price: { type: Number },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Booking", bookingSchema);
