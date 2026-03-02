const Vehicle = require("../../models/Vehicle");
const { throwError, validateObjectId } = require("../../utils");
const { deleteImage } = require("../uploads");

exports.deleteVehicleById = async (id) => {
  validateObjectId(id, "Vehicle Id");
  const vehicle = await Vehicle.findById(id);
  if (!vehicle || vehicle.isDeleted) throwError(404, "Vehicle not found");

  if (vehicle.image) await deleteImage(vehicle.image);
  vehicle.image = null;
  vehicle.isDeleted = true;
  vehicle.isActive = false;
  vehicle.updatedAt = new Date();
  await vehicle.save();
  return;
};
