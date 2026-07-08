const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    attempts: {
      type: Number,
      required: true,
      default: 5,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Score", scoreSchema);
