// routes/auth.routes.js
const express = require("express");
const router = express.Router();

// Make sure this matches the exact controller file name
const { registerUser, loginUser } = require("../controllers/auth.controller");

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

module.exports = router;
