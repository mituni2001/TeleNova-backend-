const express = require("express");
const router = express.Router();
const { createBatteryBank, getBatteryBanks } = require("../controllers/batteryBank.controller");

router.post("/", createBatteryBank);
router.get("/", getBatteryBanks);

module.exports = router;