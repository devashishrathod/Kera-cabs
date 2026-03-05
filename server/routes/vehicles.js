const express = require("express");
const router = express.Router();

const { isAdminOrStaff, verifyJwtToken } = require("../middlewares");
const {
  createVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicles");

router.post("/create", isAdminOrStaff, createVehicle);
router.get("/getAll", isAdminOrStaff, getAllVehicles);
router.get("/get/:id", isAdminOrStaff, getVehicle);
router.put("/update/:id", isAdminOrStaff, updateVehicle);
router.delete("/delete/:id", isAdminOrStaff, deleteVehicle);

module.exports = router;
