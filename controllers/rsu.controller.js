// controllers/rsu.controller.js
const RSU = require("../models/rsu.model");

// ➕ Add new RSU
exports.addRSU = async (req, res) => {
  try {
    const rsu = await RSU.create(req.body);
    res.status(201).json({ success: true, data: rsu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📄 Get all RSUs
exports.getRSUs = async (req, res) => {
  try {
    const rsus = await RSU.find();
    res.status(200).json(rsus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔄 Update RSU by ID
exports.updateRSU = async (req, res) => {
  const { id } = req.params;
  try {
    // runValidators: true ensures enum/required validation is applied on update
    const rsu = await RSU.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!rsu) return res.status(404).json({ message: "RSU not found" });
    res.status(200).json({ success: true, data: rsu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// ❌ Delete single RSU by ID
exports.deleteRSU = async (req, res) => {
  try {
    const { id } = req.params;
    const rsu = await RSU.findByIdAndDelete(id);
    if (!rsu) return res.status(404).json({ message: "RSU not found" });
    res.status(200).json({ success: true, message: "RSU deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

// 🔴 Delete all RSUs
exports.deleteAllRSUs = async (req, res) => {
  try {
    await RSU.deleteMany({});
    res.status(200).json({ success: true, message: "All RSUs deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete all failed", error: err.message });
  }
};