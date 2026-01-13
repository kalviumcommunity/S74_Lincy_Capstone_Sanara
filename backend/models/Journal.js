const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  content: {
    type: String,
    required: true,
  },

  /* Emotion as human-readable label */
  mood: {
    type: String,
    enum: ["Sad", "Anxious", "Calm", "Happy", "Overwhelmed"],
    required: true,
  },

  /* Energy as numeric signal */
  energy: {
    type: Number,
    min: 1,
    max: 3,
    required: true,
  },

  context: {
    type: String,
    enum: ["Work", "Sleep", "Social", "Health", "Personal", "Other"],
    default: "Personal",
  },

  tags: {
    type: [String],
    default: [],
  },

  isDraft: {
    type: Boolean,
    default: false,
  },

  /* Ownership */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Journal", journalSchema);
