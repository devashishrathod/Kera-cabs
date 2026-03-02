const { createVehicle } = require("./createVehicle");
const { getVehicleById } = require("./getVehicleById");
const { getAllVehicles } = require("./getAllVehicles");
const { updateVehicleById } = require("./updateVehicleById");
const { deleteVehicleById } = require("./deleteVehicleById");

module.exports = {
  createVehicle,
  getVehicleById,
  getAllVehicles,
  updateVehicleById,
  deleteVehicleById,
};
