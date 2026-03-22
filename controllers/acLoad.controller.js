const ACLoad = require("../models/ACLoad.model");

// Create AC Load
exports.createACLoad = async (req, res) => {
  try {
    const acload = await ACLoad.create(req.body);
    res.status(201).json({ success: true, message: "AC Load saved", data: acload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all AC Loads
exports.getACLoads = async (req, res) => {
  try {
    const loads = await ACLoad.find();
    res.status(200).json(loads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};