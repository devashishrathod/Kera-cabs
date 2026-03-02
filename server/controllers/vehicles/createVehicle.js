const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createVehicle } = require("../../services/vehicles");
const { validateCreateVehicle } = require("../../validator/vehicles");

exports.createVehicle = asyncWrapper(async (req, res) => {
  const { error } = validateCreateVehicle(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const image = req.files?.image;
  const vehicle = await createVehicle(req.body, image);
  return sendSuccess(res, 201, "Vehicle created successfully", vehicle);
});
