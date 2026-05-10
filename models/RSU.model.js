// models/RSU.model.js
const mongoose = require("mongoose");

const RectifierSchema = new mongoose.Schema({
  type:          { type: String,   default: "" },
  installedDate: { type: Date,     default: null },
  moduleType:    { type: String,   default: "" },
  modules: {
    working: { type: Number, default: 0 },
    faulty:  { type: Number, default: 0 },
  },
  capacity:       { type: Number,   default: 0 },
  dcLoad:         { type: Number,   default: 0 },
  phase:          { type: String,   default: "" },
  connectedNodes: { type: [String], default: ["", "", "", ""] },
});

const BatteryBankSchema = new mongoose.Schema({
  brand:              { type: String, default: "" },
  batteryType:        { type: String, default: "" },
  voltage:            { type: String, default: "" },
  ah:                 { type: Number, default: 0  },
  connectedRectifier: { type: String, default: "" },
  health:             { type: String, default: "" },
});

const ACUnitSchema = new mongoose.Schema({
  type:     { type: String,  default: "" },
  inverter: { type: Boolean, default: false },
  btu:      { type: Number,  default: 0   },
  health:   { type: String,  default: "" },
});

const GeneratorSchema = new mongoose.Schema({
  model:     { type: String,  default: "" },
  capacity:  { type: String,  default: "" },
  brand:     { type: String,  default: "" },
  ats:       { type: Boolean, default: false },
  available: { type: Boolean, default: false },
});

const ACLoadSchema = new mongoose.Schema({
  phase1:  { type: String, default: "" },
  phase2:  { type: String, default: "" },
  phase3:  { type: String, default: "" },
  neutral: { type: String, default: "" },
});

const RSUSchema = new mongoose.Schema(
  {
    rsuName:            { type: String, required: true, trim: true },
    primaryRectifier:   { type: RectifierSchema,    default: () => ({}) },
    secondaryRectifier: { type: RectifierSchema,    default: () => ({}) },
    batteryBanks:       { type: [BatteryBankSchema], default: []        },
    acUnits:            { type: [ACUnitSchema],      default: []        },
    generator:          { type: GeneratorSchema,    default: () => ({}) },
    acLoad:             { type: ACLoadSchema,       default: () => ({}) },
  },
  { timestamps: true }
);

// Guard against OverwriteModelError during hot-reload
module.exports = mongoose.models.RSU || mongoose.model("RSU", RSUSchema);