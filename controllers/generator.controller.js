const Generator = require("../models/Generator.model");

exports.createGenerator = async (req, res) => {
  try {
     const data = req.body.generator || req.body;
    

    // 🔥 Convert Yes/No to Boolean
    if (data.ats === "Yes") data.ats = true;
    if (data.ats === "No") data.ats = false;

    if (data.available === "Yes") data.available = true;
    if (data.available === "No") data.available = false;

    const generator = await Generator.create(data);

    res.status(201).json({
      success: true,
      message: "Generator saved",
      data: generator
    });
  } catch (err) {
    console.error("Generator Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getGenerators = async (req, res) => {
  try {
    const generators = await Generator.find();
    res.status(200).json(generators);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};