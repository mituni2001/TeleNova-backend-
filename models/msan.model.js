const mongoose = require("mongoose");

const batterySchema = new mongoose.Schema({
  type: String,
  voltage: Number,
  health: String,
});

const msanSchema = new mongoose.Schema({
  msanName: String,
  vendor: String,
  msanType: String,
  rectifierType: String,
  faultyRectifierModules: Number,
  workingRectifierModules: Number,
  battery: [batterySchema],
}, { timestamps: true });

// ✅ FIX OVERWRITE ERROR
module.exports = mongoose.models.MSAN || mongoose.model("MSAN", msanSchema);
