const mongoose = require("mongoose");
const { categoryField } = require("./validObjectId");

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    categoryId: { ...categoryField, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
