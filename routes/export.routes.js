                 // routes/export.routes.js
const express    = require("express");
const router     = express.Router();
const exportCtrl = require("../controllers/export.controller");

// GET /api/export/msan  → download MSAN_Data.xlsx
router.get("/msan", exportCtrl.exportMSAN);

// GET /api/export/rsu   → download RSU_DATA.xlsx
router.get("/rsu",  exportCtrl.exportRSU);

module.exports = router;  