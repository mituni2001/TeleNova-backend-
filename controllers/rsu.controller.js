// controllers/rsu.controller.js
const RSU = require("../models/RSU.model");

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(String(id || ""));

// POST /api/rsu
exports.createRSU = async (req, res) => {
  try {
    const doc = await RSU.create(req.body);
    // වරද තිබ්බේ මෙතනයි. { success: true, data: doc } වෙනුවට කෙළින්ම doc එක යවන්න ඕනේ.
    res.status(201).json(doc); 
  } catch (e) {
    console.error("[createRSU]", e.message);
    res.status(400).json({ message: e.message });
  }
};

// GET /api/rsu
exports.getAllRSU = async (_req, res) => {
  try {
    const docs = await RSU.find().sort({ createdAt: -1 }).lean();
    res.json(docs);
  } catch (e) {
    console.error("[getAllRSU]", e.message);
    res.status(500).json({ message: e.message });
  }
};

// GET /api/rsu/:id
exports.getRSUById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid RSU ID format" });

    const doc = await RSU.findById(id).lean();
    if (!doc)
      return res.status(404).json({ message: "RSU not found" });

    res.json(doc);
  } catch (e) {
    console.error("[getRSUById]", e.message);
    res.status(500).json({ message: e.message });
  }
};

// PUT /api/rsu/:id
exports.updateRSU = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid RSU ID format" });

    const doc = await RSU.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!doc)
      return res.status(404).json({ message: "RSU not found" });

    // මෙතනත් { success: true, data: doc } වෙනුවට කෙළින්ම doc එක යවන්න
    res.status(200).json(doc);
  } catch (e) {
    console.error("[updateRSU]", e.message);
    res.status(400).json({ message: e.message });
  }
};

// DELETE /api/rsu/:id
exports.deleteRSU = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid RSU ID format" });

    await RSU.findByIdAndDelete(id);
    res.json({ message: "RSU deleted successfully" });
  } catch (e) {
    console.error("[deleteRSU]", e.message);
    res.status(500).json({ message: e.message });
  }
};

// DELETE /api/rsu/delete/all
exports.deleteAllRSU = async (_req, res) => {
  try {
    await RSU.deleteMany({});
    res.json({ message: "All RSU records deleted" });
  } catch (e) {
    console.error("[deleteAllRSU]", e.message);
    res.status(500).json({ message: e.message });
  }
}; 