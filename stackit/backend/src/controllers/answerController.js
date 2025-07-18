const Answer = require("../models/Answer");

const postAnswer = async (req, res) => {
  try {
    const { title, description, userId, username, questionId } = req.body;

    if (!title || !description || !userId || !username || !questionId) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const answer = new Answer({
      title,
      description,
      questionId,
      author: {
        id: userId,
        username: username,
      },
    });

    const savedAnswer = await answer.save();

    res.status(201).json({
      msg: "Answer submitted successfully",
      data: savedAnswer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const upvoteAnswer = async (req, res) => {
  try {
    const { answerId } = req.body;

    if (!answerId) {
      return res.status(400).json({ msg: "Missing answerId in request body" });
    }

    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!updatedAnswer) {
      return res.status(404).json({ msg: "Answer not found" });
    }

    res.status(200).json({
      msg: "Answer upvoted successfully",
      data: updatedAnswer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getAllAnswers = async (req, res) => {
  try {
    const { questionId } = req.query;

    const filter = questionId ? { questionId } : {};

    const answers = await Answer.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      msg: "Answers fetched successfully",
      data: answers,
    });
  } catch (err) {
    console.error("Error fetching answers:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  postAnswer,
  upvoteAnswer,
  getAllAnswers,
};
