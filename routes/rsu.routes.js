// routes/rsu.routes.js
const express = require("express");
const router = express.Router();
const {
  addRSU,
  getRSUs,
  updateRSU,
  deleteRSU,
  deleteAllRSUs,
} = require("../controllers/rsu.controller");

// ➕ Add new RSU
router.post("/", addRSU);

// 📄 Get all RSUs
router.get("/", getRSUs);

// 🔄 Update RSU by ID
router.put("/:id", updateRSU);

// 🔴 Delete all RSUs (keep before single delete)
router.delete("/delete/all", deleteAllRSUs);

// ❌ Delete single RSU by ID
router.delete("/:id", deleteRSU);

module.exports = router;