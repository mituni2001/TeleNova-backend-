const express = require("express");
const router = express.Router();
const { createGenerator, getGenerators } = require("../controllers/generator.controller");

router.post("/", createGenerator);
router.get("/", getGenerators);

module.exports = router;