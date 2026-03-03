const mongoose = require("mongoose");
const { userField } = require("./validObjectId");

const bookingSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    userId: { ...userField, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["confirmed", "pending", "completed", "cancelled"],
      default: "pending",
    },
    noOfDays: { type: Number, required: true },
    price: { type: Number },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Booking", bookingSchema);
