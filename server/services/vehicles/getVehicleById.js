const mongoose = require("mongoose");
const Vehicle = require("../../models/Vehicle");

exports.getVehicleById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const pipeline = [
    {
      $match: { _id: new mongoose.Types.ObjectId(id), isDeleted: false },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        isActive: 1,
        createdAt: 1,
        updatedAt: 1,
        category: "$category",
      },
    },
  ];

  const [vehicle] = await Vehicle.aggregate(pipeline);
  return vehicle || null;
};
