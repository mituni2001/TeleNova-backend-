// server.js
const express  = require("express");
const cors     = require("cors");
const dotenv   = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Route registration order matters:
//    export routes MUST come before rsu/msan routes so that
//    /api/export/rsu is not swallowed by /api/rsu/:id
app.use("/api/export", require("./routes/export.routes"));
app.use("/api/rsu",    require("./routes/rsu.routes"));
app.use("/api/msan",   require("./routes/msan.routes"));
app.use("/api/auth",   require("./routes/auth.routes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));