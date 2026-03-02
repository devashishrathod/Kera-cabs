const Joi = require("joi");

exports.validateCreateCompany = (data) => {
  const createSchema = Joi.object({
    name: Joi.string().min(2).max(120).required().messages({
      "string.min": "Name should have at least {#limit} characters",
      "string.max": "Name should not exceed {#limit} characters",
    }),
    description: Joi.string().allow("").max(500).optional(),
    isActive: Joi.boolean().optional(),
  });
  return createSchema.validate(data, { abortEarly: false });
};

exports.validateUpdateCompany = (data) => {
  const updateSchema = Joi.object({
    name: Joi.string().min(2).max(120).optional(),
    description: Joi.string().allow("").max(500).optional(),
    isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
  });
  return updateSchema.validate(data, { abortEarly: false });
};

exports.validateGetAllCompaniesQuery = (payload) => {
  const getAllQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),
    search: Joi.string().optional(),
    name: Joi.string().optional(),
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
