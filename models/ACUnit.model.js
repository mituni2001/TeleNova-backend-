const mongoose = require("mongoose");

const ACUnitSchema = new mongoose.Schema({
  type: { type: String, enum: ["Wall", "Ceiling", "Floor"] },
  inverter: Boolean,
  btu: Number,
  health: { type: String, enum: ["Good", "Weak"] }
});

module.exports = mongoose.model("ACUnit", ACUnitSchema);