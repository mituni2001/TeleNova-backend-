const express = require("express");
const router = express.Router();
const { createACLoad, getACLoads } = require("../controllers/acLoad.controller");

router.post("/", createACLoad);
router.get("/", getACLoads);

module.exports = router;