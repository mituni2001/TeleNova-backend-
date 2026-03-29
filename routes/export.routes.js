const express = require("express");
const router = express.Router();
const exportController = require("../controllers/export.controller");

// MSAN Excel
router.get("/msan", exportController.exportMSAN);

// RSU Excel
router.get("/rsu", exportController.exportRSU);

module.exports = router;
