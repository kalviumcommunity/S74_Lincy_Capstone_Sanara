const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');

// POST a new journal
router.post('/', async (req, res) => {
  try {
    const { title, content, mood, tags, isDraft } = req.body;
    const newEntry = new Journal({ title, content, mood, tags, isDraft });
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save journal entry' });
  }
});

// GET all journals
router.get('/', async (req, res) => {
  try {
    const journals = await Journal.find().sort({ createdAt: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch journals' });
  }
});

// PUT to update a journal
router.put('/:id', async (req, res) => {
  try {
    const { title, content, mood, tags, isDraft } = req.body;
    const updated = await Journal.findByIdAndUpdate(
      req.params.id,
      { title, content, mood, tags, isDraft },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update journal entry' });
  }
});

module.exports = router;