const Question = require("../models/Question");
const Answer = require("../models/Answer");
const User = require("../models/User");
const Notification = require("../models/Notification");

const askQuestion = async (req, res) => {
  try {
    const { title, description, tags, userId, username } = req.body;

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

    // Check for mentions in title and description
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const combinedText = `${title} ${description}`;
    const mentionedUsernames = [];
    let match;
    
    while ((match = mentionRegex.exec(combinedText)) !== null) {
      mentionedUsernames.push(match[1]);
    }

    // Create notifications for mentioned users
    if (mentionedUsernames.length > 0) {
      const mentionedUsers = await User.find({
        username: { $in: mentionedUsernames }
      });

      const notifications = mentionedUsers.map((user) => ({
        userId: user._id,
        message: `You were mentioned by @${username} in a question: "${title}"`,
        questionId: savedQuestion._id,
        type: "mention",
        isRead: false,
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

    res.status(201).json({
      msg: "Question created successfully",
      data: savedQuestion,
    });
  } catch (err) {
    console.error("Error in askQuestion:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find(
      {},
      {
        title: 1,
        description: 1,
        tags: 1,
        "author.username": 1,
        createdAt: 1,
        upvotes: 1,
      }
    );

    // Get answer counts for each question
    const questionsWithAnswerCounts = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({ questionId: question._id });
        return {
          ...question.toObject(),
          answerCount: answerCount
        };
      })
    );

    res.status(200).json({
      msg: "Questions fetched successfully",
      data: questionsWithAnswerCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getNewestQuestions = async (req, res) => {
  try {
    // Find all questions sorted by creation date (newest first)
    const questions = await Question.find(
      {},
      {
        title: 1,
        description: 1,
        tags: 1,
        "author.username": 1,
        createdAt: 1,
        upvotes: 1,
      }
    ).sort({ createdAt: -1 }); // -1 for descending order (newest first)

    // Get answer counts for each question
    const questionsWithAnswerCounts = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({ questionId: question._id });
        return {
          ...question.toObject(),
          answerCount: answerCount
        };
      })
    );

    res.status(200).json({
      msg: "Newest questions fetched successfully",
      data: questionsWithAnswerCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getUnansweredQuestions = async (req, res) => {
  try {
    // Find all questions
    const questions = await Question.find(
      {},
      {
        title: 1,
        description: 1,
        tags: 1,
        "author.username": 1,
        createdAt: 1,
        upvotes: 1,
      }
    );

    // Get answer counts and filter out questions with answers
    const questionsWithAnswerCounts = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({ questionId: question._id });
        return {
          ...question.toObject(),
          answerCount: answerCount
        };
      })
    );

    // Filter to only include questions with 0 answers
    const unansweredQuestions = questionsWithAnswerCounts.filter(question => question.answerCount === 0);

    res.status(200).json({
      msg: "Unanswered questions fetched successfully",
      data: unansweredQuestions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      return res.status(400).json({ msg: "Question ID is required" });
    }

    // Find the question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    // Find all answers for this question
    const answers = await Answer.find({ questionId: questionId }).sort({ createdAt: -1 });

    res.status(200).json({
      msg: "Question and answers fetched successfully",
      data: {
        question: question,
        answers: answers
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

const upvoteQuestion = async (req, res) => {
  try {
    const { questionId } = req.body;

    if (!questionId) {
      return res.status(400).json({ msg: "Question ID is required" });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ msg: "Question not found" });
    }

    res.status(200).json({
      msg: "Question upvoted successfully",
      data: updatedQuestion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  askQuestion,
  getAllQuestions,
  getNewestQuestions,
  getUnansweredQuestions,
  getQuestionById,
  upvoteQuestion,
};
