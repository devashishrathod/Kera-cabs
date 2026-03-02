const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { updateCompanyById } = require("../../services/companies");
const { validateUpdateCompany } = require("../../validator/companies");

exports.updateCompany = asyncWrapper(async (req, res) => {
  const { error } = validateUpdateCompany(req.body);
  if (error) throwError(422, cleanJoiError(error));
  const image = req.files?.image;
  const updated = await updateCompanyById(req.params?.id, req.body, image);
  return sendSuccess(res, 200, "Company updated successfully", updated);
});
