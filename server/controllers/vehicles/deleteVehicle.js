const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteVehicleById } = require("../../services/vehicles");

exports.deleteVehicle = asyncWrapper(async (req, res) => {
  await deleteVehicleById(req.params?.id);
  return sendSuccess(res, 200, "Vehicle deleted successfully");
});
