const Company = require("../../models/Company");
const { throwError } = require("../../utils");
const { uploadImage } = require("../uploads");

exports.createCompany = async (payload, image) => {
  let { name, description, isActive } = payload;

  name = name?.toLowerCase();
  description = description?.toLowerCase();

  const existing = await Company.findOne({ name, isDeleted: false });
  if (existing) throwError(409, "Company already exists with this name");

  let imageUrl;
  if (image) imageUrl = await uploadImage(image.tempFilePath);

  return await Company.create({
    name,
    description,
    image: imageUrl,
    isActive,
  });
};
