const Question = require("../models/Question");

const User = require("../models/User");
const Notification = require("../models/notification");

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

    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const combinedText = `${title} ${description}`;
    const mentionedUsernames = [];
    let match;
    while ((match = mentionRegex.exec(combinedText)) !== null) {
      mentionedUsernames.push(match[1]);
    }

    console.log("Mentioned usernames:", mentionedUsernames);

    if (mentionedUsernames.length > 0) {
      const mentionedUsers = await User.find({
        username: { $in: mentionedUsernames },
      });

      console.log("Found mentioned users:", mentionedUsers);

      const notifications = mentionedUsers.map((user) => ({
        userId: user._id,
        message: `You were mentioned by @${username} in a question.`,
        questionId: savedQuestion._id,
        createdAt: new Date(),
        isRead: false,
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log("Notifications inserted:", notifications);
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
