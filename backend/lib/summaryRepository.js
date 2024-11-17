const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createSummary(summary, title, subject, userId) {
  try {
    const insertedSummary = await prisma.summary.create({
      data: {
        title: title,
        content: summary,
        subject: subject,
        userId: Number(userId),
      },
    });
    return insertedSummary;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getUserSummaries(userId) {
  try {
    const summaries = await prisma.summary.findMany({
      where: {
        userId: Number(userId),
      },
    });

    summaries.forEach((summary) => {
      summary.type = "summary";
    });
    
    return summaries;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  createSummary,
  getUserSummaries,
};
