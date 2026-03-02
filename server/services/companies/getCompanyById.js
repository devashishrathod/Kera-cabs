const Company = require("../../models/Company");
const { throwError, validateObjectId } = require("../../utils");

exports.getCompanyById = async (id) => {
  validateObjectId(id, "Company Id");
  const company = await Company.findById(id);
  if (!company || company.isDeleted) throwError(404, "Company not found");
  return company;
};
