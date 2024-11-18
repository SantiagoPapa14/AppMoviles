const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createSummary(title, subject, summaryContent,userId) {
  try {
    const insertedSummary = await prisma.summary.create({
      data: {
        title: title,
        content: summaryContent,
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

async function getSummaryById(id) {
  try {
    const summary = await prisma.summary.findUnique({
      where: { projectId: Number(id) },
      include: { user: true },
    });
    return summary;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  createSummary,
  getUserSummaries,
  getSummaryById,
};
