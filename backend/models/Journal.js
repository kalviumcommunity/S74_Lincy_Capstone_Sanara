const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    mood: { type: String, default: "Neutral" },
    tags: { type: [String], default: [] },
    isDraft: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journal", journalSchema);
