const express = require("express");
const router = express.Router();

const { isAdminOrStaff, verifyJwtToken } = require("../middlewares");
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

router.post("/create", isAdminOrStaff, createCategory);
router.get("/getAll", isAdminOrStaff, getAllCategories);
router.get("/get/:id", isAdminOrStaff, getCategory);
router.put("/update/:id", isAdminOrStaff, updateCategory);
router.delete("/delete/:id", isAdminOrStaff, deleteCategory);

module.exports = router;
