const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    answerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["mention", "answer", "upvote"],
      default: "mention",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
