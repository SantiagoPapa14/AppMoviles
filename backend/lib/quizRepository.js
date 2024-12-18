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
        user: true,
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

const searchQuizzes = async (query) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        user: true,
      },
    });
    return quizzes;
  } catch (error) {
    console.error("Error searching decks:", error);
    return null;
  }
};

const getAllQuizzes = async () => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        user: true,
        questions: true,
      },
      orderBy: {
        views: "desc",
      },
      take: 10,
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
    const quiz = await prisma.quiz.update({
      where: { projectId: Number(id) },
      data: {
        views: {
          increment: 1,
        },
      },
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

const deleteQuiz = async (id) => {
  try {
    const deletedQuiz = await prisma.quiz.delete({
      where: { projectId: Number(id) },
    });
    return deletedQuiz;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return null;
  }
};

module.exports = {
  createQuiz,
  getUserQuizzes,
  getQuizById,
  updateQuiz,
  getAllQuizzes,
  searchQuizzes,
  deleteQuiz,
};
