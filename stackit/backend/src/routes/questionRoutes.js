const express = require("express");
const router = express.Router();
const {
  askQuestion,
  getAllQuestions,
  getNewestQuestions,
  getUnansweredQuestions,
  getQuestionById,
  upvoteQuestion,
} = require("../controllers/questionController");

// Route to ask a question
router.post("/ask", askQuestion);

// Route to get all questions
router.get("/fetch", getAllQuestions);

// Route to get newest questions
router.get("/newest", getNewestQuestions);

// Route to get unanswered questions
router.get("/unanswered", getUnansweredQuestions);

// Route to get a specific question by ID
router.get("/:questionId", getQuestionById);

// Route to upvote a question
router.post("/upvote", upvoteQuestion);

module.exports = router;
