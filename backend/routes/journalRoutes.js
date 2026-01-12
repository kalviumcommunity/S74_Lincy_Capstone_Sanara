const express = require("express");
const router = express.Router();
const Journal = require("../models/Journal");
const verifyToken = require("../middleware/verifyToken");

/* ============================
   CREATE JOURNAL
   ============================ */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content, mood, tags, isDraft } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const journal = new Journal({
      title,
      content,
      mood: mood || "Neutral",
      tags: tags || [],
      isDraft: isDraft || false,
      user: req.user.id, // 🔥 REQUIRED
    });

    const saved = await journal.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("CREATE JOURNAL ERROR:", err);
    res.status(500).json({ error: "Failed to create journal" });
  }
});

/* ============================
   GET ALL JOURNALS (DASHBOARD)
   ============================ */
router.get("/", verifyToken, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(journals);
  } catch (err) {
    console.error("FETCH JOURNALS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch journals" });
  }
});

/* ============================
   GET SINGLE JOURNAL (EDIT)
   ============================ */
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
    console.error("FETCH SINGLE JOURNAL ERROR:", err);
    res.status(500).json({ error: "Failed to fetch journal" });
  }
});

/* ============================
   UPDATE JOURNAL
   ============================ */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, content, mood, tags, isDraft } = req.body;

    const updated = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        title,
        content,
        mood,
        tags,
        isDraft,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Journal not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE JOURNAL ERROR:", err);
    res.status(500).json({ error: "Failed to update journal" });
  }
});

/* ============================
   DELETE JOURNAL
   ============================ */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Journal not found" });
    }

    res.json({ message: "Journal deleted successfully" });
  } catch (err) {
    console.error("DELETE JOURNAL ERROR:", err);
    res.status(500).json({ error: "Failed to delete journal" });
  }
});

module.exports = router;
