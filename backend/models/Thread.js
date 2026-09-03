const mongoose = require("mongoose");

const actionItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const updateSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    aiShiftNote: { type: String, default: "" },
  },
  { _id: true }
);

const threadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    situationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Situation",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Decision pending", "Resolved"],
      default: "Active",
      index: true,
    },
    currentStage: {
      type: String,
      default: "untangled",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    actionItems: {
      type: [actionItemSchema],
      default: [],
    },
    unfinishedThoughts: {
      type: [String],
      default: [],
    },
    updates: {
      type: [updateSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Thread", threadSchema);
