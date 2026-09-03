const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const Situation = require("../models/Situation");
const Thread = require("../models/Thread");
const Event = require("../models/Event");
const Reflection = require("../models/Reflection");
const Decision = require("../models/Decision");
const Outcome = require("../models/Outcome");

const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const normalizeEmail = (email) => email?.trim().toLowerCase();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name || "Thoughtful User",
      email,
      password: hashedPassword,
      provider: "local",
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "sanara_jwt_secret_2026", {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(400).json({
        error: "This account was registered using Google Sign-In. Please sign in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "sanara_jwt_secret_2026", {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name || "Thoughtful User",
        email: user.email,
        provider: user.provider,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

/* GOOGLE LOGIN */
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Google credential is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = normalizeEmail(payload.email);
    const googleId = payload.sub;
    const name = payload.name;

    if (!email || !googleId) {
      return res.status(400).json({ error: "Google account data is missing" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || "Thoughtful User",
        email,
        provider: "google",
        googleId,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "sanara_jwt_secret_2026", {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    res.status(401).json({ error: err.message || "Google authentication failed" });
  }
});

/* ME */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("FETCH ME ERROR:", err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

/* UPDATE PROFILE & PREFERENCES */
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, preferences } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      preferences: user.preferences,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
});

/* PRIVACY: EXPORT USER DATA */
router.get("/export-data", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    const situations = await Situation.find({ userId });
    const threads = await Thread.find({ userId });
    const events = await Event.find({ userId });
    const reflections = await Reflection.find({ userId });
    const decisions = await Decision.find({ userId });
    const outcomes = await Outcome.find({ userId });

    const exportBundle = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      situations,
      threads,
      events,
      reflections,
      decisions,
      outcomes,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=sanara_export_${userId}.json`);
    res.send(JSON.stringify(exportBundle, null, 2));
  } catch (err) {
    console.error("EXPORT DATA ERROR:", err);
    res.status(500).json({ error: "Failed to export data." });
  }
});

/* PRIVACY: DELETE USER DATA & ACCOUNT */
router.delete("/delete-account", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await Situation.deleteMany({ userId });
    await Thread.deleteMany({ userId });
    await Event.deleteMany({ userId });
    await Reflection.deleteMany({ userId });
    await Decision.deleteMany({ userId });
    await Outcome.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: "All user data and account successfully deleted." });
  } catch (err) {
    console.error("DELETE ACCOUNT ERROR:", err);
    res.status(500).json({ error: "Failed to delete account." });
  }
});

module.exports = router;
