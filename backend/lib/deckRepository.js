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

    console.log("Deck saved successfully:", savedDeck);
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
    return decks;
  } catch (error) {
    console.error("Error fetching decks:", error);
    return null;
  }
};

module.exports = {
  createDeck,
  getUserDecks,
};