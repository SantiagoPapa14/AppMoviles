const express = require("express");
const router = express.Router();
router.use(express.json());

const {
  createDeck,
  getDeckById,
  getFlashcardById,
  updateDeck,
  deleteDeck,
} = require("../lib/deckRepository");

const authLib = require("../lib/authLib");

router.post("/", authLib.validateAuthorization, async (req, res) => {
  try {
    const { title, flashcards } = req.body;

    if (!title || !flashcards) {
      res.status(400).json({
        message: "Please provide title and flashcards",
      });
      return;
    }
    
    const newDeck = await createDeck(
      { title, flashcards },
      req.userData.userId,
    );
    res.status(200).json({
      message: "Deck created successfully!",
      deck: newDeck,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

router.get("/:id", authLib.validateAuthorization, async (req, res) => {
  try {
    const deck = await getDeckById(req.params.id);
    if (!deck) {
      res.status(404).json({ message: "Deck not found" });
      return;
    }
    res.status(200).json(deck);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to fetch deck", error: err.message });
  }
});

router.get(
  "/flashcard/:id",
  authLib.validateAuthorization,
  async (req, res) => {
    try {
      const flashcard = await getFlashcardById(req.params.id);
      if (!flashcard) {
        res.status(404).json({ message: "Flashcard not found" });
        return;
      }
      res.status(200).json(flashcard);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "Failed to fetch flashcard", error: err.message });
    }
  },
);

router.patch("/:id", authLib.validateAuthorization, async (req, res) => {
  try {
    const { title, flashcards } = req.body;
    if (!title || !flashcards) {
      res.status(400).json({
        message: "Please provide title and flashcards",
      });
      return;
    }

    const updatedDeck = await updateDeck(req.params.id, {
      title,
      flashcards,
    });
    if (!updatedDeck) {
      res.status(404).json({ message: "Deck not found" });
      return;
    }
    res.status(200).json({
      message: "Deck updated successfully!",
      deck: updatedDeck,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

router.delete("/:id", authLib.validateAuthorization, async (req, res) => {
  try {
    const deckId = req.params.id;
    const deletedDeck = await deleteDeck(deckId);
    if (!deletedDeck) {
      res.status(404).json({ message: "Deck not found" });
      return;
    }
    res.status(200).json({ message: "Deck deleted successfully!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to delete deck", error: err.message });
  }
});

module.exports = router;
