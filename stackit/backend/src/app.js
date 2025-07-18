const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Mount login route
app.use("/api/auth", authRoutes);
// Mount question routes
app.use("/api/questions", questionRoutes);
// Mount answer routes
app.use("/api/answers", answerRoutes);
// Mount notification routes
app.use("/api/notifications", notificationRoutes);

module.exports = app;
