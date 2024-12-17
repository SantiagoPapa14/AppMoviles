const express = require("express");
const router = express.Router();
router.use(express.json());

const authLib = require("../lib/authLib");

const { searchSummaries } = require("../lib/summaryRepository");
const { searchQuizzes } = require("../lib/quizRepository");
const { searchDecks } = require("../lib/deckRepository");

router.get("/:query", authLib.validateAuthorization, async (req, res) => {
  try {
    const query = req.params.query;
    console.log(query);
    const foundDecks = await searchDecks(query);
    const foundQuizzes = await searchQuizzes(query);
    const foundSummaries = await searchSummaries(query);
    const results = {
      decks: foundDecks,
      quizzes: foundQuizzes,
      summaries: foundSummaries,
    };
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch search results",
      error: err.message,
    });
  }
});

module.exports = router;
