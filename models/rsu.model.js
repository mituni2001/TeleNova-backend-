const mongoose = require("mongoose");

// ===== RECTIFIER SCHEMA =====
const RectifierSchema = new mongoose.Schema({
  type: {
    type: String,
    default: ""
  },

  installedDate: {
    type: Date,
    default: null
  },

  moduleType: {
    type: String,
    default: ""
  },

  workingCount: {
    type: Number,
    default: 0
  },

  faultyCount: {
    type: Number,
    default: 0
  },

  capacity: {
    type: Number,
    default: 0 // in Amps
  },

  dcLoad: {
    type: Number,
    default: 0
  },

  phase: {
  type: String,
  enum: ["Single", "Three", "Single Phase", "Three Phase"],
  default: "Single"
},

  connectedNodes: {
    type: [String],
    default: []
  }

}, { _id: false });


// ===== RSU SCHEMA =====
const RSUSchema = new mongoose.Schema({

  rsuName: {
    type: String,
    required: true,
    trim: true
  },

  primaryRectifier: {
    type: RectifierSchema,
    default: {}
  },

  secondaryRectifier: {
    type: RectifierSchema,
    default: {}
  }

}, { timestamps: true });


// ===== EXPORT MODEL =====
module.exports = mongoose.models.RSU || mongoose.model("RSU", RSUSchema);