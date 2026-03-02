const Company = require("../../models/Company");
const { throwError, validateObjectId } = require("../../utils");
const { deleteImage } = require("../uploads");

exports.deleteCompanyById = async (id) => {
  validateObjectId(id, "Company Id");
  const company = await Company.findById(id);
  if (!company || company.isDeleted) throwError(404, "Company not found");

  if (company.image) await deleteImage(company.image);
  company.image = null;
  company.isDeleted = true;
  company.isActive = false;
  company.updatedAt = new Date();
  await company.save();
  return;
};
