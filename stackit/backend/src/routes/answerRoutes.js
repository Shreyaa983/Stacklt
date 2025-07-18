const express = require("express");
const router = express.Router();
const { postAnswer, upvoteAnswer } = require("../controllers/answerController");

// Submit an answer
router.post("/post", postAnswer);

// Upvote an answer
router.post("/upvote", upvoteAnswer);

// Get answers by question ID
router.get('/question/:questionId', getAnswersByQuestion);

module.exports = router;
