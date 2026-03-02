const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllVehicles } = require("../../services/vehicles");
const { validateGetAllVehiclesQuery } = require("../../validator/vehicles");

exports.getAllVehicles = asyncWrapper(async (req, res) => {
  const { error } = validateGetAllVehiclesQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllVehicles(req.query);
  return sendSuccess(res, 200, "Vehicles fetched successfully", result);
});
