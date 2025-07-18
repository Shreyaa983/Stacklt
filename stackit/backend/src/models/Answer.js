const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "Answer" },
    description: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
    author: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
      username: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answer", answerSchema);
