const Joi = require("joi");
const objectId = require("./validJoiObjectId");

exports.validateCreateVehicle = (data) => {
  const createSchema = Joi.object({
    name: Joi.string().min(2).max(120).required(),
    description: Joi.string().allow("").max(500).optional(),
    categoryId: objectId().required().messages({
      "any.invalid": "Invalid categoryId format",
    }),
    isActive: Joi.boolean().optional(),
  });
  return createSchema.validate(data, { abortEarly: false });
};

exports.validateUpdateVehicle = (data) => {
  const updateSchema = Joi.object({
    name: Joi.string().min(2).max(120).optional(),
    description: Joi.string().allow("").max(500).optional(),
    categoryId: objectId().optional().messages({
      "any.invalid": "Invalid categoryId format",
    }),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
  });
  return updateSchema.validate(data, { abortEarly: false });
};

exports.validateGetAllVehiclesQuery = (payload) => {
  const getAllQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    name: Joi.string().optional(),
    categoryId: objectId().optional().messages({
      "any.invalid": "Invalid categoryId format",
    }),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),
    sortBy: Joi.string()
      .valid("createdAt", "updatedAt", "name", "isActive")
      .optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return getAllQuerySchema.validate(payload, { abortEarly: false });
};
