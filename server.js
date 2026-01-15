const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// 🔹 ROOT ROUTE (THIS FIXES "Cannot GET /")
app.get("/", (req, res) => {
  res.send("🚀 TaskNest API is running successfully");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
