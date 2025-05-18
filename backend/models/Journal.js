const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  title: String,
  content: String,
  mood: {
    type: String,
    enum: ['Happy', 'Calm', 'Neutral', 'Anxious', 'Sad', 'Mixed'],
    default: 'Neutral'
  },
  tags: [String],
  isDraft: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Journal', journalSchema);
