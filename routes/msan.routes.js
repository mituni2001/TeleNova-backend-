// routes/msan.routes.js
const router = require("express").Router();
const {
  addMSAN,
  getAllMSAN,
  updateMSAN,
  deleteMSAN,
  deleteAllMSAN
} = require("../controllers/msan.controller");

// ==================
// MSAN ROUTES
// ==================

// Add new MSAN
router.post("/", addMSAN);

// Get all MSAN
router.get("/", getAllMSAN);

// Delete ALL MSAN records first (avoid conflict with :id)
router.delete("/delete/all", deleteAllMSAN);

// Update MSAN by ID
router.put("/:id", updateMSAN);

// Delete single MSAN by ID
router.delete("/:id", deleteMSAN);

module.exports = router;