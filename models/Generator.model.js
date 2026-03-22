// backend/models/Generator.model.js
const mongoose = require("mongoose");

const generatorSchema = new mongoose.Schema({
  model: { type: String, required: true },
  capacity: { type: String, default: "" },
  brand: { type: String, default: "" },
  ats: { type: Boolean, default: false },
  available: { type: Boolean, default: false }, // ✅ ADD THIS
}, { timestamps: true });

  

const Generator = mongoose.model("Generator", generatorSchema);

module.exports = Generator;