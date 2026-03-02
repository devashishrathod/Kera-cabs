const {
  asyncWrapper,
  sendSuccess,
  throwError,
  cleanJoiError,
} = require("../../utils");
const { getAllCompanies } = require("../../services/companies");
const { validateGetAllCompaniesQuery } = require("../../validator/companies");

exports.getAllCompanies = asyncWrapper(async (req, res) => {
  const { error } = validateGetAllCompaniesQuery(req.query);
  if (error) throwError(422, cleanJoiError(error));
  const result = await getAllCompanies(req.query);
  return sendSuccess(res, 200, "Companies fetched successfully", result);
});
