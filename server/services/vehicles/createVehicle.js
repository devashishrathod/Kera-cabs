const Vehicle = require("../../models/Vehicle");
const Category = require("../../models/Category");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage } = require("../uploads");

exports.createVehicle = async (payload, image) => {
  let { name, description, categoryId, isActive } = payload;

  validateObjectId(categoryId, "Category Id");
  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false,
  });
  if (!category) throwError(404, "Category not found");

  name = name?.toLowerCase();
  description = description?.toLowerCase();

  const existing = await Vehicle.findOne({
    name,
    categoryId,
    isDeleted: false,
  });
  if (existing) throwError(409, "Vehicle already exists with this name");

  let imageUrl;
  if (image) imageUrl = await uploadImage(image.tempFilePath);

  return await Vehicle.create({
    name,
    description,
    categoryId,
    image: imageUrl,
    isActive,
  });
};
