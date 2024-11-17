const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createQuiz = async (quiz, userId) => {
  try {
    const savedQuiz = await prisma.quiz.create({
      data: {
        title: quiz.title,
        userId,
        questions: {
          create: quiz.questions.map((q) => ({
            question: q.question,
            answer: q.answer,
            decoy1: q.decoy1,
            decoy2: q.decoy2,
            decoy3: q.decoy3,
          })),
        },
      },
    });
    return savedQuiz;
  } catch (error) {
    console.error("Error saving quiz:", error);
  }
};

const getUserQuizzes = async (userId) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        questions: true,
      },
    });
    return quizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return null;
  }
};

module.exports = {
  createQuiz,
  getUserQuizzes,
};
