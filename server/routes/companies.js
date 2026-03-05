const express = require("express");
const router = express.Router();

const { isAdminOrStaff, verifyJwtToken } = require("../middlewares");
const {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companies");

router.post("/create", isAdminOrStaff, createCompany);
router.get("/getAll", isAdminOrStaff, getAllCompanies);
router.get("/get/:id", isAdminOrStaff, getCompany);
router.put("/update/:id", isAdminOrStaff, updateCompany);
router.delete("/delete/:id", isAdminOrStaff, deleteCompany);

module.exports = router;
