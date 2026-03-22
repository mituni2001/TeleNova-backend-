const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/ac-load", require("./routes/acLoad.routes"));
app.use("/api/ac-unit", require("./routes/acUnit.routes"));
app.use("/api/battery-bank", require("./routes/batteryBank.routes"));
app.use("/api/generator", require("./routes/generator.routes"));
app.use("/api/msan", require("./routes/msan.routes"));
app.use("/api/rsu", require("./routes/rsu.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/export", require("./routes/export.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));