const User = require("../../models/User");
const { pagination } = require("../../utils");

exports.getAllUsers = async (query) => {
  let {
    page,
    limit,
    search,
    name,
    email,
    mobile,
    address,
    role,
    loginType,
    isEmailVerified,
    isMobileVerified,
    isSignUpCompleted,
    isOnBoardingCompleted,
    isLoggedIn,
    isOnline,
    isActive,
    fromDate,
    toDate,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  page = page ? Number(page) : 1;
  limit = limit ? Number(limit) : 10;

  const match = { isDeleted: false, role: { $ne: "admin" } };

  if (name) match.name = { $regex: new RegExp(name, "i") };
  if (email) match.email = { $regex: new RegExp(email, "i") };
  if (address) match.address = { $regex: new RegExp(address, "i") };
  if (role) match.role = role;
  if (loginType) match.loginType = loginType;
  if (mobile) match.mobile = Number(mobile);

  const parseBool = (v) => v === true || v === "true";

  if (typeof isEmailVerified !== "undefined") {
    match.isEmailVerified = parseBool(isEmailVerified);
  }
  if (typeof isMobileVerified !== "undefined") {
    match.isMobileVerified = parseBool(isMobileVerified);
  }
  if (typeof isSignUpCompleted !== "undefined") {
    match.isSignUpCompleted = parseBool(isSignUpCompleted);
  }
  if (typeof isOnBoardingCompleted !== "undefined") {
    match.isOnBoardingCompleted = parseBool(isOnBoardingCompleted);
  }
  if (typeof isLoggedIn !== "undefined") {
    match.isLoggedIn = parseBool(isLoggedIn);
  }
  if (typeof isOnline !== "undefined") {
    match.isOnline = parseBool(isOnline);
  }
  if (typeof isActive !== "undefined") {
    match.isActive = parseBool(isActive);
  }

  if (search) {
    const s = new RegExp(search, "i");
    const mobileNum = Number(search);
    const or = [
      { name: { $regex: s } },
      { email: { $regex: s } },
      { address: { $regex: s } },
      { role: { $regex: s } },
      { loginType: { $regex: s } },
    ];
    if (!Number.isNaN(mobileNum)) or.push({ mobile: mobileNum });
    match.$or = or;
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
    $project: {
      name: 1,
      address: 1,
      dob: 1,
      role: 1,
      loginType: 1,
      email: 1,
      mobile: 1,
      lastActivity: 1,
      lastLocation: 1,
      currentLocation: 1,
      fcmToken: 1,
      image: 1,
      currentScreen: 1,
      isEmailVerified: 1,
      isMobileVerified: 1,
      isSignUpCompleted: 1,
      isOnBoardingCompleted: 1,
      isLoggedIn: 1,
      isOnline: 1,
      isActive: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  });

  const sortStage = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
  pipeline.push({ $sort: sortStage });

  return await pagination(User, pipeline, page, limit);
};
