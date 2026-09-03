const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pros: { type: [String], default: [] },
    concerns: { type: [String], default: [] },
  },
  { _id: false }
);

const decisionSchema = new mongoose.Schema(
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
    question: {
      type: String,
      required: true,
    },
    optionA: {
      type: optionSchema,
      required: true,
    },
    optionB: {
      type: optionSchema,
      required: true,
    },
    priorities: {
      career: { type: Number, default: 50 },
      energy: { type: Number, default: 50 },
      money: { type: Number, default: 50 },
      learning: { type: Number, default: 50 },
      time: { type: Number, default: 50 },
      stability: { type: Number, default: 50 },
    },
    selectedOption: {
      type: String,
      default: "",
    },
    reasoning: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Decision", decisionSchema);
