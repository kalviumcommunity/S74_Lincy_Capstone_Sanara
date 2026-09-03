const mongoose = require("mongoose");

const outcomeSchema = new mongoose.Schema(
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
    expectedOutcome: {
      type: String,
      default: "",
    },
    actionTaken: {
      type: String,
      default: "",
    },
    actualOutcome: {
      type: String,
      default: "",
    },
    learned: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Outcome", outcomeSchema);
