const { asyncWrapper, sendSuccess, throwError } = require("../../utils");
const { getVehicleById } = require("../../services/vehicles");

exports.getVehicle = asyncWrapper(async (req, res) => {
  const vehicle = await getVehicleById(req.params?.id);
  if (!vehicle) throwError(404, "Vehicle not found");
  return sendSuccess(res, 200, "Vehicle fetched", vehicle);
});
