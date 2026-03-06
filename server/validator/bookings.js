const Joi = require("joi");
const objectId = require("./validJoiObjectId");
const { BOOKING_STATUS } = require("../constants");

exports.validateCreateBooking = (data) => {
  const schema = Joi.object({
    companyId: objectId().required().messages({
      "any.invalid": "Invalid companyId format",
    }),
    categoryId: objectId().required().messages({
      "any.invalid": "Invalid categoryId format",
    }),
    userId: objectId().required().messages({
      "any.invalid": "Invalid userId format",
    }),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().required(),
    status: Joi.string()
      .valid(...Object.values(BOOKING_STATUS))
      .optional(),
    price: Joi.number().min(0).optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateUpdateBooking = (data) => {
  const schema = Joi.object({
    companyId: objectId().optional().messages({
      "any.invalid": "Invalid companyId format",
    }),
    categoryId: objectId().optional().messages({
      "any.invalid": "Invalid categoryId format",
    }),
    userId: objectId().optional().messages({
      "any.invalid": "Invalid userId format",
    }),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    status: Joi.string()
      .valid(...Object.values(BOOKING_STATUS))
      .optional(),
    price: Joi.number().min(0).optional(),
    isDeleted: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

exports.validateGetAllBookingsQuery = (payload) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).optional(),

    companyId: objectId().optional(),
    categoryId: objectId().optional(),
    userId: objectId().optional(),
    bookedBy: objectId().optional(),
    status: Joi.string()
      .valid(...Object.values(BOOKING_STATUS))
      .optional(),

    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),

    startFrom: Joi.date().iso().optional(),
    startTo: Joi.date().iso().optional(),
    endFrom: Joi.date().iso().optional(),
    endTo: Joi.date().iso().optional(),

    createdFrom: Joi.date().iso().optional(),
    createdTo: Joi.date().iso().optional(),

    fromDate: Joi.date().iso().optional(),
    toDate: Joi.date().iso().optional(),

    sortBy: Joi.string()
      .valid(
        "createdAt",
        "updatedAt",
        "startDate",
        "endDate",
        "status",
        "noOfDays",
        "price",
      )
      .optional(),
    sortOrder: Joi.string().valid("asc", "desc").optional(),
  });
  return schema.validate(payload, { abortEarly: false });
};
