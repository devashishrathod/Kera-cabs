const Company = require("../../models/Company");
const { throwError, validateObjectId } = require("../../utils");
const { uploadImage, deleteImage } = require("../uploads");

exports.updateCompanyById = async (id, payload = 0, image) => {
  validateObjectId(id, "Company Id");
  const company = await Company.findById(id);
  if (!company || company.isDeleted) throwError(404, "Company not found");

  if (payload) {
    let { name, description, isActive } = payload;

    if (typeof isActive !== "undefined") company.isActive = !company.isActive;

    if (name) {
      name = name.toLowerCase();
      const existing = await Company.findOne({
        _id: { $ne: id },
        name,
        isDeleted: false,
      });
      if (existing) throwError(400, "Another company exists with this name");
      company.name = name;
    }

    if (typeof description !== "undefined") {
      company.description = description ? description?.toLowerCase() : "";
    }
  }

  if (image) {
    if (company.image) await deleteImage(company.image);
    const imageUrl = await uploadImage(image.tempFilePath);
    company.image = imageUrl;
  }

  company.updatedAt = new Date();
  await company.save();
  return company;
};
