const { createCompany } = require("./createCompany");
const { getCompanyById } = require("./getCompanyById");
const { getAllCompanies } = require("./getAllCompanies");
const { updateCompanyById } = require("./updateCompanyById");
const { deleteCompanyById } = require("./deleteCompanyById");

module.exports = {
  createCompany,
  getCompanyById,
  getAllCompanies,
  updateCompanyById,
  deleteCompanyById,
};
