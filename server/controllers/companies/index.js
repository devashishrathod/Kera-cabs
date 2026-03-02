const { createCompany } = require("./createCompany");
const { getAllCompanies } = require("./getAllCompanies");
const { getCompany } = require("./getCompany");
const { updateCompany } = require("./updateCompany");
const { deleteCompany } = require("./deleteCompany");

module.exports = {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
};
