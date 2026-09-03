const mongoose = require("mongoose");

const reflectionSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["reality_check", "general", "unfinished_thought"],
      default: "general",
    },
    claim: {
      type: String,
      default: "",
    },
    evidenceFor: {
      type: [String],
      default: [],
    },
    evidenceAgainst: {
      type: [String],
      default: [],
    },
    balancedInterpretation: {
      type: String,
      default: "",
    },
    question: {
      type: String,
      default: "",
    },
    response: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reflection", reflectionSchema);
