const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const journalRoutes = require("./routes/journalRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);

/* =========================
   DATABASE
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* =========================
   ROUTES
========================= */
app.use("/api/journals", journalRoutes);
app.use("/api/auth", authRoutes);

/* =========================
   HEALTH CHECK (DEBUGGING)
========================= */
app.get("/", (req, res) => {
  res.json({ status: "Sanara backend running" });
});

/* =========================
   ERROR HANDLER (FALLBACK)
========================= */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
