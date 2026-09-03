const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "User",
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // 🔐 Password only for local auth users
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },

    // 🔑 Auth provider
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // 🆔 Google account ID
    googleId: {
      type: String,
      default: null,
    },

    preferences: {
      theme: { type: String, default: "light" },
      aiPrivacy: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
