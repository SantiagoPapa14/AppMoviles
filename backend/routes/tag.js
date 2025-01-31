const express = require("express");
const router = express.Router();
router.use(express.json());

const authLib = require("../lib/authLib");
const {
  createSummaryTags,
  createQuizTags,
  createDeckTags,
  searchSummariesByTag,
  searchQuizzesByTag,
  searchDecksByTag,
  getAllTags,
} = require("../lib/tagRepository");

router.post("/summary", authLib.validateAuthorization, async (req, res) => {
  try {
    const { tagsIds, summaryId } = req.body;
    if (!tagsIds || !summaryId) {
      res.status(400).json({ message: "Please provide tagsIds and summaryId" });
      return;
    }
    const tags = await createSummaryTags(tagsIds, summaryId);
    res.status(200).json({ message: "Summary tags created successfully!", tags });
  } catch (err) {
    console.error("Error creating summary tags:", err);
    res.status(500).json({ message: "Failed to create summary tags", error: err.message });
  }
});

router.post("/quiz", authLib.validateAuthorization, async (req, res) => {
  try {
    const { tagsIds, quizId } = req.body;
    if (!tagsIds || !quizId) {
      res.status(400).json({ message: "Please provide tagsIds and quizId" });
      return;
    }
    const tags = await createQuizTags(tagsIds, quizId);
    res.status(200).json({ message: "Quiz tags created successfully!", tags });
  } catch (err) {
    console.error("Error creating quiz tags:", err);
    res.status(500).json({ message: "Failed to create quiz tags", error: err.message });
  }
});

router.post("/deck", authLib.validateAuthorization, async (req, res) => {
  try {
    const { tagsIds, deckId } = req.body;
    if (!tagsIds || !deckId) {
      res.status(400).json({ message: "Please provide tagsIds and deckId" });
      return;
    }
    const tags = await createDeckTags(tagsIds, deckId);
    console.log(tags);
    res.status(200).json({ message: "Deck tags created successfully!", tags });
  } catch (err) {
    console.error("Error creating deck tags:", err);
    res.status(500).json({ message: "Failed to create deck tags", error: err.message });
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
