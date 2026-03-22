const BatteryBank = require("../models/BatteryBank.model");

exports.createBatteryBank = async (req, res) => {
  try {
    const bank = await BatteryBank.create(req.body);
    res.status(201).json({ success: true, message: "Battery Bank saved", data: bank });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBatteryBanks = async (req, res) => {
  try {
    const banks = await BatteryBank.find();
    res.status(200).json(banks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
