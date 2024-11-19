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

const getUserDecks = async (userId) => {
  try {
    const decks = await prisma.deck.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        flashcards: true,
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
    const deck = await prisma.deck.findUnique({
      where: { projectId: Number(id) },
      include: { flashcards: true, user: true },
    });
    return deck;
  } catch (error) {
    console.error("Error fetching deck:", error);
    return null;
  }
};

module.exports = {
  createDeck,
  getUserDecks,
  getDeckById,
  getFlashcardById,
};
