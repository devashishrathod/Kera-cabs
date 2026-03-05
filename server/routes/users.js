const express = require("express");
const router = express.Router();

const {
  getUser,
  updateUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/users");
const { verifyJwtToken, isAdminOrStaff } = require("../middlewares");

router.get("/get", isAdminOrStaff, getUser);
router.get("/getAll", isAdminOrStaff, getAllUsers);
router.put("/update", isAdminOrStaff, updateUser);
router.delete("/delete/:id", isAdminOrStaff, deleteUser);

module.exports = router;
