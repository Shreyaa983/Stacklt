const Question = require("../models/Question");

const askQuestion = async (req, res) => {
  try {
    const { title, description, tags, userId, username } = req.body;

    // Check for required fields
    if (!title || !description || !userId || !username) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const question = new Question({
      title,
      description,
      tags,
      author: {
        id: userId,
        username: username,
      },
    });

    const savedQuestion = await question.save();

    res.status(201).json({
      msg: "Question created successfully",
      data: savedQuestion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    // Find all questions, project only required fields
    const questions = await Question.find(
      {},
      {
        title: 1,
        description: 1,
        tags: 1,
        "author.username": 1,
      }
    );

    res.status(200).json({
      msg: "Questions fetched successfully",
      data: questions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  askQuestion,
  getAllQuestions,
};
