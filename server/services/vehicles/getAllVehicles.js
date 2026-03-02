const mongoose = require("mongoose");
const Vehicle = require("../../models/Vehicle");
const { pagination } = require("../../utils");

exports.getAllVehicles = async (query) => {
  let {
    page,
    limit,
    search,
    name,
    categoryId,
    isActive,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const match = { isDeleted: false };

  if (typeof isActive !== "undefined") {
    match.isActive = isActive === "true" || isActive === true;
  }

  if (categoryId) match.categoryId = new mongoose.Types.ObjectId(categoryId);

  if (name) match.name = { $regex: new RegExp(name, "i") };

  if (search) {
    match.$or = [
      { name: { $regex: new RegExp(search, "i") } },
      { description: { $regex: new RegExp(search, "i") } },
    ];
  }

  if (fromDate || toDate) {
    match.createdAt = {};
    if (fromDate) match.createdAt.$gte = new Date(fromDate);
    if (toDate) {
      const d = new Date(toDate);
      d.setHours(23, 59, 59, 999);
      match.createdAt.$lte = d;
    }
  }

  const pipeline = [{ $match: match }];

  pipeline.push({
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category",
    },
  });
  pipeline.push({ $unwind: { path: "$category", preserveNullAndEmptyArrays: true } });

  pipeline.push({
    $project: {
      name: 1,
      description: 1,
      image: 1,
      isActive: 1,
      createdAt: 1,
      updatedAt: 1,
      category: "$category",
    },
  });

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  return await pagination(Vehicle, pipeline, page, limit);
};
