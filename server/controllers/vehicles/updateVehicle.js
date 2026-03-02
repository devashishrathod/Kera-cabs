const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateVehicleById } = require("../../services/vehicles");
const { validateUpdateVehicle } = require("../../validator/vehicles");

exports.updateVehicle = asyncWrapper(async (req, res) => {
  const { error } = validateUpdateVehicle(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const image = req.files?.image;
  const updated = await updateVehicleById(req.params?.id, req.body, image);
  return sendSuccess(res, 200, "Vehicle updated successfully", updated);
});
