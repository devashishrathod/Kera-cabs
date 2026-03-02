const Vehicle = require("../../models/Vehicle");
const Category = require("../../models/Category");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage, deleteImage } = require("../uploads");

exports.updateVehicleById = async (id, payload = 0, image) => {
  validateObjectId(id, "Vehicle Id");
  const vehicle = await Vehicle.findById(id);
  if (!vehicle || vehicle.isDeleted) throwError(404, "Vehicle not found");

  if (payload) {
    let { name, description, categoryId, isActive } = payload;

    if (typeof isActive !== "undefined") vehicle.isActive = !vehicle.isActive;

    if (categoryId) {
      validateObjectId(categoryId, "Category Id");
      const category = await Category.findOne({
        _id: categoryId,
        isDeleted: false,
      });
      if (!category) throwError(404, "Category not found");
      vehicle.categoryId = categoryId;
    }

    if (name) {
      name = name.toLowerCase();
      const existing = await Vehicle.findOne({
        _id: { $ne: id },
        name,
        categoryId: vehicle.categoryId,
        isDeleted: false,
      });
      if (existing) throwError(400, "Another vehicle exists with this name");
      vehicle.name = name;
    }

    if (typeof description !== "undefined") {
      vehicle.description = description ? description?.toLowerCase() : "";
    }
  }

  if (image) {
    if (vehicle.image) await deleteImage(vehicle.image);
    const imageUrl = await uploadImage(image.tempFilePath);
    vehicle.image = imageUrl;
  }

  vehicle.updatedAt = new Date();
  await vehicle.save();
  return vehicle;
};
