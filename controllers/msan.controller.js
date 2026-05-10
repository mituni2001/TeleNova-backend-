const MSAN = require("../models/msan.model");

// Add MSAN
exports.addMSAN = async (req, res) => {
  try {
    const newMSAN = new MSAN(req.body);
    await newMSAN.save();
    res.json({ success: true, message: "MSAN saved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all MSAN
exports.getAllMSAN = async (req, res) => {
  try {
    const data = await MSAN.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update MSAN
exports.updateMSAN = async (req, res) => {
  try {
    const updated = await MSAN.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({ success: true, message: "MSAN updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete single MSAN
exports.deleteMSAN = async (req, res) => {
  try {
    await MSAN.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "MSAN deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete ALL MSAN
exports.deleteAllMSAN = async (req, res) => {
  try {
    await MSAN.deleteMany({});
    res.json({ success: true, message: "All MSAN records deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};