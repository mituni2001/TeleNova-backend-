const express = require("express");
const router = express.Router();
const { createACUnit, getACUnits } = require("../controllers/acUnit.controller");

router.post("/", createACUnit);
router.get("/", getACUnits);

module.exports = router;
