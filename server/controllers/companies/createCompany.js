const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { createCompany } = require("../../services/companies");
const { validateCreateCompany } = require("../../validator/companies");

exports.createCompany = asyncWrapper(async (req, res) => {
  const { error } = validateCreateCompany(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const image = req.files?.image;
  const company = await createCompany(req.body, image);
  return sendSuccess(res, 201, "Company created successfully", company);
});
