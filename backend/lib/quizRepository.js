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

    console.log("Quiz saved successfully:", savedQuiz);
    return savedQuiz;
  } catch (error) {
    console.error("Error saving quiz:", error);
  }
};

module.exports = {
  createQuiz,
};
