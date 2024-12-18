const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createSummary(
  title,
  subject,
  summaryContent,
  files = [],
  userId,
) {
  try {
    const insertedSummary = await prisma.summary.create({
      data: {
        title: title,
        content: summaryContent,
        subject: subject,
        userId: Number(userId),
      },
    });

    if (files.length > 0) {
      for (const file of files) {
        console.log("FILE IN PRISMA", file);
        await prisma.summaryFile.create({
          data: {
            filename: `${userId}-${file.name}`,
            summaryId: insertedSummary.projectId,
          },
        });
      }
    }
    return insertedSummary;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function EditSummary(
  title,
  subject,
  summaryContent,
  files,
  userId,
  projectId,
) {
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
    if (files.length > 0) {
      for (const file of files) {
        console.log("FILE IN PRISMA", file);
        await prisma.summaryFile.create({
          data: {
            filename: `${userId}-${file.name}`,
            summaryId: updatedSummary.projectId,
          },
        });
      }
    }
    return updatedSummary;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const searchSummaries = async (query) => {
  try {
    const summaries = await prisma.summary.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        user: true,
      },
    });
    return summaries;
  } catch (error) {
    console.error("Error searching decks:", error);
    return null;
  }
};

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
      take: 10,
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
      include: { user: true, files: true },
    });
    return summary;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const deleteSummary = async (id) => {
  try {
    const deletedSummary = await prisma.summary.delete({
      where: { projectId: Number(id) },
    });
    return deletedSummary;
  } catch (error) {
    console.error("Error deleting summary:", error);
    return null;
  }
};

const deleteSummaryFiles = async (id) => {
  try {
    const deletedSummary = await prisma.summaryFile.deleteMany({
      where: { summaryId: Number(id) },
    });
    return deletedSummary;
  } catch (error) {
    console.error("Error deleting summary:", error);
    return null;
  }
};

module.exports = {
  createSummary,
  getUserSummaries,
  getSummaryById,
  EditSummary,
  getAllSummaries,
  searchSummaries,
  deleteSummary,
  deleteSummaryFiles,
};
