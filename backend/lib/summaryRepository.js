const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createSummary(title, subject, summaryContent, userId) {
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

async function EditSummary(title, subject, summaryContent, projectId) {
  try {
    const updatedSummary = await prisma.summary.update({
      where: {
        projectId: Number(projectId),
      },
      data: {
        title: title,
        content: summaryContent,
        subject: subject,
      },
    });
    return updatedSummary;
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
      include: { user: true },
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

async function getAllSummaries() {
  try {
    const summaries = await prisma.summary.findMany({
      include: { user: true },
      orderBy: {
        views: "desc",
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
    const summary = await prisma.summary.update({
      where: { projectId: Number(id) },
      data: {
        views: {
          increment: 1,
        },
      },
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
  EditSummary,
  getAllSummaries,
};
