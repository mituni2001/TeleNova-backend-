const ACUnit = require("../models/ACUnit.model");

exports.createACUnit = async (req, res) => {
  try {
    const acUnit = await ACUnit.create(req.body);
    res.status(201).json({ success: true, message: "AC Unit saved", data: acUnit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getACUnits = async (req, res) => {
  try {
    const units = await ACUnit.find();
    res.status(200).json(units);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

