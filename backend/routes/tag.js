const express = require("express");
const router = express.Router();
router.use(express.json());

const authLib = require("../lib/authLib");
const {
  createSummaryTag,
  createQuizTag,
  createDeckTag,
  searchSummariesByTag,
  searchQuizzesByTag,
  searchDecksByTag,
  getAllTags,
} = require("../lib/tagRepository");

router.post("/summary", authLib.validateAuthorization, async (req, res) => {
  try {
    const { tagId, summaryId } = req.body;
    if (!tagId || !summaryId) {
      res.status(400).json({ message: "Please provide tagId and summaryId" });
      return;
    }
    const tag = await createSummaryTag(tagId, summaryId);
    res.status(200).json({ message: "Summary tag created successfully!", tag });
  } catch (err) {
    console.error("Error creating summary tag:", err);
    res.status(500).json({ message: "Failed to create summary tag", error: err.message });
  }
});

router.post("/quiz", authLib.validateAuthorization, async (req, res) => {
  try {
    const { tagId, quizId } = req.body;
    if (!tagId || !quizId) {
      res.status(400).json({ message: "Please provide tagId and quizId" });
      return;
    }
    const tag = await createQuizTag(tagId, quizId);
    res.status(200).json({ message: "Quiz tag created successfully!", tag });
  } catch (err) {
    console.error("Error creating quiz tag:", err);
    res.status(500).json({ message: "Failed to create quiz tag", error: err.message });
  }
});

router.post("/deck", authLib.validateAuthorization, async (req, res) => {
  try {
    const { tagId, deckId } = req.body;
    if (!tagId || !deckId) {
      res.status(400).json({ message: "Please provide tagId and deckId" });
      return;
    }
    const tag = await createDeckTag(tagId, deckId);
    res.status(200).json({ message: "Deck tag created successfully!", tag });
  } catch (err) {
    console.error("Error creating deck tag:", err);
    res.status(500).json({ message: "Failed to create deck tag", error: err.message });
  }
});

router.get("/summary/:tagName", authLib.validateAuthorization, async (req, res) => {
  try {
    const tagName = req.params.tagName;
    const summaries = await searchSummariesByTag(tagName);
    res.status(200).json(summaries);
  } catch (err) {
    console.error("Error searching summaries by tag:", err);
    res.status(500).json({ message: "Failed to search summaries by tag", error: err.message });
  }
});

router.get("/quiz/:tagName", authLib.validateAuthorization, async (req, res) => {
  try {
    const tagName = req.params.tagName;
    const quizzes = await searchQuizzesByTag(tagName);
    res.status(200).json(quizzes);
  } catch (err) {
    console.error("Error searching quizzes by tag:", err);
    res.status(500).json({ message: "Failed to search quizzes by tag", error: err.message });
  }
});

router.get("/deck/:tagName", authLib.validateAuthorization, async (req, res) => {
  try {
    const tagName = req.params.tagName;
    const decks = await searchDecksByTag(tagName);
    res.status(200).json(decks);
  } catch (err) {
    console.error("Error searching decks by tag:", err);
    res.status(500).json({ message: "Failed to search decks by tag", error: err.message });
  }
});

router.get("/all", authLib.validateAuthorization, async (req, res) => {
  try {
    const tags = await getAllTags();
    res.status(200).json(tags);
  } catch (err) {
    console.error("Error fetching tags:", err);
    res.status(500).json({ message: "Failed to fetch tags", error: err.message });
  }
});

module.exports = router;
