const express = require("express");
const router = express.Router();
const {
  askQuestion,
  getAllQuestions,
} = require("../controllers/questionController");

router.post("/ask", askQuestion); //

router.get("/fetch", getAllQuestions);

module.exports = router;
