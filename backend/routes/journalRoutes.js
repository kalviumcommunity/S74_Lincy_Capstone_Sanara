const express = require("express");
const router = express.Router();
const Journal = require("../models/Journal");
const verifyToken = require("../middleware/verifyToken");

/**
 * CREATE journal
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content, mood, tags, energy, context, isDraft } = req.body;

    const journal = new Journal({
      title,
      content,
      mood,
      tags,
      energy,
      context,
      isDraft: Boolean(isDraft),
      user: req.user.id,
    });

    const saved = await journal.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to save journal" });
  }
});

/**
 * ✅ GET journals (SPLIT drafts + entries)
 * THIS FIXES YOUR DASHBOARD CRASH
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    const drafts = journals.filter(j => j.isDraft);
    const entries = journals.filter(j => !j.isDraft);

    res.json({
      drafts,
      entries,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch journals" });
  }
});

/**
 * GET single journal
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }

    res.json(journal);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch journal" });
  }
});

/**
 * UPDATE journal
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Journal not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update journal" });
  }
});

/**
 * DELETE journal
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({ message: "Journal deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete journal" });
  }
});

module.exports = router;
