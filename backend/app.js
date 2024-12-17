const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3000;
const authLib = require("./lib/authLib");

const { getAllSummaries } = require("./lib/summaryRepository");
const { getAllQuizzes } = require("./lib/quizRepository");
const { getAllDecks } = require("./lib/deckRepository");

const quizRoutes = require("./routes/quiz.js");
const userRoutes = require("./routes/user.js");
const deckRoutes = require("./routes/deck.js");
const summaryRoutes = require("./routes/summary.js");
const searchRoutes = require("./routes/search.js");
const fileRoutes = require("./routes/file.js");

app.use("/quiz", quizRoutes);
app.use("/user", userRoutes);
app.use("/deck", deckRoutes);
app.use("/summary", summaryRoutes);
app.use("/search", searchRoutes);
app.use("/file", fileRoutes);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  }),
);

app.use("/uploads", express.static("uploads"));

app.get("/all-projects", authLib.validateAuthorization, async (req, res) => {
  try {
    const allSummaries = await getAllSummaries();
    const allQuizzes = await getAllQuizzes();
    const allDecks = await getAllDecks();

    res.status(200).json({
      summaries: allSummaries,
      quizzes: allQuizzes,
      decks: allDecks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch user content",
      error: err.message,
    });
  }
});

app.get("/", authLib.validateAuthorization, (req, res) => {
  const message = "Welcome to the secret backend " + req.userData.username;
  res.send(message);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
