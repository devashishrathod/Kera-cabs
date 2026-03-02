const { asyncWrapper, sendSuccess } = require("../../utils");
const { getCompanyById } = require("../../services/companies");

exports.getCompany = asyncWrapper(async (req, res) => {
  const company = await getCompanyById(req.params?.id);
  return sendSuccess(res, 200, "Company fetched", company);
});
