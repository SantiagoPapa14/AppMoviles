const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createDeck = async (deck, userId) => {
  try {
    const savedDeck = await prisma.deck.create({
      data: {
        title: deck.title,
        userId,
        flashcards: {
          create: deck.flashcards.map((f) => ({
            front: f.front,
            back: f.back,
          })),
        },
      },
    });

    return savedDeck;
  } catch (error) {
    console.error("Error saving deck:", error);
  }
};

const searchDecks = async (query) => {
  try {
    const decks = await prisma.deck.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        user: true,
      },
    });
    return decks;
  } catch (error) {
    console.error("Error searching decks:", error);
    return null;
  }
};

const getUserDecks = async (userId) => {
  try {
    const decks = await prisma.deck.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        flashcards: true,
        user: true,
      },
    });

    decks.forEach((deck) => {
      deck.type = "flashcard";
    });

    return decks;
  } catch (error) {
    console.error("Error fetching decks:", error);
    return null;
  }
};

const getAllDecks = async () => {
  try {
    const decks = await prisma.deck.findMany({
      include: {
        user: true,
        flashcards: true,
      },
      orderBy: {
        views: "desc",
      },
    });
    decks.forEach((deck) => {
      deck.type = "flashcard";
    });
    return decks;
  } catch (error) {
    console.error("Error fetching decks:", error);
    return null;
  }
};

const getFlashcardById = async (id) => {
  try {
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: Number(id) },
      include: { deck: { include: { user: true } } },
    });
    return flashcard;
  } catch (error) {
    console.error("Error fetching flashcard:", error);
    return null;
  }
};

const getDeckById = async (id) => {
  try {
    const deck = await prisma.deck.update({
      where: { projectId: Number(id) },
      data: {
        views: {
          increment: 1,
        },
      },
      include: { flashcards: true, user: true },
    });
    return deck;
  } catch (error) {
    console.error("Error fetching deck:", error);
    return null;
  }
};

const updateDeck = async (id, deckContent) => {
  try {
    const updatedDeck = await prisma.deck.update({
      where: { projectId: Number(id) },
      data: {
        title: deckContent.title,
        flashcards: {
          deleteMany: {}, // Delete existing flashcards
          create: deckContent.flashcards.map((f) => ({
            front: f.front,
            back: f.back,
          })),
        },
      },
    });
    return updatedDeck;
  } catch (error) {
    console.error("Error updating deck:", error);
    return null;
  }
};

module.exports = {
  createDeck,
  getUserDecks,
  getDeckById,
  getFlashcardById,
  updateDeck,
  getAllDecks,
  searchDecks,
};
