const { asyncWrapper, sendSuccess } = require("../../utils");
const { deleteCompanyById } = require("../../services/companies");

exports.deleteCompany = asyncWrapper(async (req, res) => {
  await deleteCompanyById(req.params?.id);
  return sendSuccess(res, 200, "Company deleted successfully");
});
