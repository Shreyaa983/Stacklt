const express = require("express");
const router = express.Router();
const {
  postAnswer,
  upvoteAnswer,
  getAllAnswers,
} = require("../controllers/answerController");

// Submit an answer
router.post("/post", postAnswer);

// Upvote an answer
router.post("/upvote", upvoteAnswer);

// Fetch all answers for a question
router.get("/fetch", getAllAnswers);

module.exports = router;
