const express = require("express");
const router = express.Router();
const {
    askQuestion,
    getAllQuestions,
    searchQuestions,
} = require("../controllers/questionController");

router.post("/ask", askQuestion);

router.get("/fetch", getAllQuestions);

router.post('/search', searchQuestions);

module.exports = router;
