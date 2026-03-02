const mongoose = require("mongoose");
const Booking = require("../../models/Booking");
const { throwError } = require("../../utils");

const safeDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d;
};

exports.getAllBookings = async (query) => {
  let {
    page,
    limit,
    companyId,
    vehicleId,
    userId,
    status,
    minPrice,
    maxPrice,
    startFrom,
    startTo,
    endFrom,
    endTo,
    createdFrom,
    createdTo,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;
  const skip = (page - 1) * limit;

  const match = { isDeleted: false };

  if (companyId) match.companyId = new mongoose.Types.ObjectId(companyId);
  if (vehicleId) match.vehicleId = new mongoose.Types.ObjectId(vehicleId);
  if (userId) match.userId = new mongoose.Types.ObjectId(userId);
  if (status) match.status = status;

  if (minPrice || maxPrice) {
    match.price = {};
    if (minPrice) match.price.$gte = Number(minPrice);
    if (maxPrice) match.price.$lte = Number(maxPrice);
  }

  const sFrom = safeDate(startFrom);
  const sTo = safeDate(startTo);
  if (sFrom || sTo) {
    match.startDate = {};
    if (sFrom) match.startDate.$gte = sFrom;
    if (sTo) match.startDate.$lte = sTo;
  }

  const eFrom = safeDate(endFrom);
  const eTo = safeDate(endTo);
  if (eFrom || eTo) {
    match.endDate = {};
    if (eFrom) match.endDate.$gte = eFrom;
    if (eTo) match.endDate.$lte = eTo;
  }

  const cFrom = safeDate(createdFrom || fromDate);
  const cTo = safeDate(createdTo || toDate);
  if (cFrom || cTo) {
    match.createdAt = {};
    if (cFrom) match.createdAt.$gte = cFrom;
    if (cTo) {
      const d = new Date(cTo);
      d.setHours(23, 59, 59, 999);
      match.createdAt.$lte = d;
    }
  }

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;

  const basePipeline = [{ $match: match }];

  basePipeline.push(
    {
      $lookup: {
        from: "companies",
        localField: "companyId",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "vehicles",
        localField: "vehicleId",
        foreignField: "_id",
        as: "vehicle",
      },
    },
    { $unwind: { path: "$vehicle", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
  );

  basePipeline.push({ $sort: sortStage });

  const pipeline = [
    ...basePipeline,
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
        metrics: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
              revenue: { $sum: { $ifNull: ["$price", 0] } },
            },
          },
        ],
        totalRevenue: [
          {
            $group: {
              _id: null,
              revenue: { $sum: { $ifNull: ["$price", 0] } },
            },
          },
        ],
        monthly: [
          {
            $group: {
              _id: {
                y: { $year: "$startDate" },
                m: { $month: "$startDate" },
              },
              count: { $sum: 1 },
              revenue: { $sum: { $ifNull: ["$price", 0] } },
            },
          },
          { $sort: { "_id.y": 1, "_id.m": 1 } },
        ],
      },
    },
    {
      $project: {
        data: 1,
        total: { $arrayElemAt: ["$totalCount.count", 0] },
        metrics: 1,
        totalRevenue: { $arrayElemAt: ["$totalRevenue.revenue", 0] },
        monthly: 1,
      },
    },
  ];

  const result = await Booking.aggregate(pipeline);
  const out = result?.[0] || {};

  const data = out.data || [];
  const total = out.total || 0;

  if (!data || data.length === 0) throwError(404, "No any booking found");

  const metricsArr = out.metrics || [];
  const metrics = {
    noOfPending: 0,
    noOfConfirmed: 0,
    noOfComplated: 0,
    noOfCancelled: 0,
  };

  metricsArr.forEach((m) => {
    if (m._id === "pending") metrics.noOfPending = m.count;
    if (m._id === "confirmed") metrics.noOfConfirmed = m.count;
    if (m._id === "completed") metrics.noOfComplated = m.count;
    if (m._id === "cancelled") metrics.noOfCancelled = m.count;
  });

  const monthly = (out.monthly || []).map((x) => ({
    year: x._id.y,
    month: x._id.m,
    count: x.count,
    revenue: x.revenue,
  }));

  const current = monthly[monthly.length - 1] || null;
  const previous = monthly[monthly.length - 2] || null;

  let monthlyTrend = { current, previous, change: 0, changeType: "same" };
  if (current && previous) {
    const diff = current.count - previous.count;
    monthlyTrend.change = diff;
    monthlyTrend.changeType =
      diff > 0 ? "increment" : diff < 0 ? "decrement" : "same";
  } else if (current && !previous) {
    monthlyTrend = {
      current,
      previous: null,
      change: current.count,
      changeType: "increment",
    };
  }

  return {
    total,
    totalPages: Math.ceil(total / limit),
    page,
    limit,
    data,
    metrics: {
      ...metrics,
      totalRevenue: out.totalRevenue || 0,
      monthlyTrend,
      monthly,
    },
  };
};
