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
      deck.type = "flashcards";
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
