const mongoose = require("mongoose");

const BatteryBankSchema = new mongoose.Schema({
  brandName: String,
  batteryType: { type: String, enum: ["VRLA", "LEAD_ACID", "LFP"] },
  voltage: Number,
  ah: Number,
  connectedNodes: [String],
  health: { type: String, enum: ["Good", "Weak"] }
});

module.exports = mongoose.model("BatteryBank", BatteryBankSchema);