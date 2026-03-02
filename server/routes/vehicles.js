const express = require("express");
const router = express.Router();

const { isAdmin, verifyJwtToken } = require("../middlewares");
const {
  createVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicles");

router.post("/create", isAdmin, createVehicle);
router.get("/getAll", verifyJwtToken, getAllVehicles);
router.get("/get/:id", verifyJwtToken, getVehicle);
router.put("/update/:id", isAdmin, updateVehicle);
router.delete("/delete/:id", isAdmin, deleteVehicle);

module.exports = router;
