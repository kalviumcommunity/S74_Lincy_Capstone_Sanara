const mongoose = require("mongoose");

const situationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    rawInput: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "decision_pending", "resolved", "archived"],
      default: "active",
      index: true,
    },
    currentStage: {
      type: String,
      enum: ["untangled", "reflecting", "deciding", "resolved"],
      default: "untangled",
      index: true,
    },
    facts: {
      type: [String],
      default: [],
    },
    emotions: {
      type: [String],
      default: [],
    },
    assumptions: {
      type: [String],
      default: [],
    },
    fears: {
      type: [String],
      default: [],
    },
    needs: {
      type: [String],
      default: [],
    },
    decisions: {
      type: [String],
      default: [],
    },
    openQuestions: {
      type: [String],
      default: [],
    },
    themes: {
      type: [String],
      default: [],
    },
    embedding: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Situation", situationSchema);
