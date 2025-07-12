const express = require("express");
const router = express.Router();
const { postAnswer, upvoteAnswer } = require("../controllers/answerController");

// Submit an answer
router.post("/post", postAnswer);

// Upvote an answer
router.post("/upvote", upvoteAnswer);

module.exports = router;
