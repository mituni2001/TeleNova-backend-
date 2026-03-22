const mongoose = require("mongoose");

const ACLoadSchema = new mongoose.Schema({
  phase1: String,
  phase2: String,
  phase3: String,
  neutral: String
});

module.exports = mongoose.model("ACLoad", ACLoadSchema);