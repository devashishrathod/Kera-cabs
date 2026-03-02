const User = require("../../models/User");
const { throwError, validateObjectId } = require("../../utils");

exports.deleteUserById = async (id) => {
  validateObjectId(id, "User Id");
  const user = await User.findById(id);
  if (!user || user.isDeleted) throwError(404, "User not found");

  user.isDeleted = true;
  user.isActive = false;
  user.isLoggedIn = false;
  user.fcmToken = null;
  user.updatedAt = new Date();
  await user.save();
  return;
};
