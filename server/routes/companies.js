const express = require("express");
const router = express.Router();

const { isAdmin, verifyJwtToken } = require("../middlewares");
const {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companies");

router.post("/create", isAdmin, createCompany);
router.get("/getAll", verifyJwtToken, getAllCompanies);
router.get("/get/:id", verifyJwtToken, getCompany);
router.put("/update/:id", isAdmin, updateCompany);
router.delete("/delete/:id", isAdmin, deleteCompany);

module.exports = router;
