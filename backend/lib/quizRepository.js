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
    quizzes.forEach((quiz) => {
      quiz.type = "quiz";
    });
    return quizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return null;
  }
};

const getQuizById = async (id) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { projectId: Number(id) },
      include: { user: true, questions: true },
    });
    return quiz;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return null;
  }
};

const updateQuiz = async (id, quizContent) => {
  try {
    const updatedQuiz = await prisma.quiz.update({
      where: { projectId: Number(id) },
      data: {
        title: quizContent.title,
        questions: {
          deleteMany: {}, // Delete existing questions
          create: quizContent.questions.map((q) => ({
            question: q.question,
            answer: q.answer,
            decoy1: q.decoy1,
            decoy2: q.decoy2,
            decoy3: q.decoy3,
          })),
        },
      },
    });
    return updatedQuiz;
  } catch (error) {
    console.error("Error updating quiz:", error);
    return null;
  }
};

module.exports = {
  createQuiz,
  getUserQuizzes,
  getQuizById,
  updateQuiz,
};
