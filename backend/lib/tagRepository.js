const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createTag = async (name) => {
  try {
    let tag = await prisma.tag.findUnique({ where: { name: name.toLowerCase() } });
    if (!tag) {
      tag = await prisma.tag.create({ data: { name: name.toLowerCase() } });
    }
    return tag;
  } catch (error) {
    console.error("Error creating tag:", error);
    return null;
  }
};

const getTagsByProjectId = async (projectId) => {
  try {
    const tags = await prisma.tag.findMany({
      where: { projectId: Number(projectId) },
    });
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return null;
  }
};

const searchProjectsByTag = async (tagName) => {
  try {
    const projects = await prisma.tag.findMany({
      where: { name: tagName.toLowerCase() },
      include: { project: true },
    });
    return projects;
  } catch (error) {
    console.error("Error searching projects by tag:", error);
    return null;
  }
};

const createSummaryTag = async (name, summaryId) => {
  try {
    const tag = await createTag(name);
    const summaryTag = await prisma.summaryTag.create({
      data: { tagId: tag.id, summaryId },
    });
    return summaryTag;
  } catch (error) {
    console.error("Error creating summary tag:", error);
    return null;
  }
};

const createQuizTag = async (name, quizId) => {
  try {
    const tag = await createTag(name);
    const quizTag = await prisma.quizTag.create({
      data: { tagId: tag.id, quizId },
    });
    return quizTag;
  } catch (error) {
    console.error("Error creating quiz tag:", error);
    return null;
  }
};

const createDeckTag = async (name, deckId) => {
  try {
    const tag = await createTag(name);
    const deckTag = await prisma.deckTag.create({
      data: { tagId: tag.id, deckId },
    });
    return deckTag;
  } catch (error) {
    console.error("Error creating deck tag:", error);
    return null;
  }
};

const createSummaryTags = async (names, summaryId) => {
  try {
    const tags = await Promise.all(names.map(name => createTag(name)));
    const summaryTags = await Promise.all(tags.map(tag => prisma.summaryTag.create({
      data: { tagId: tag.id, summaryId },
    })));
    return summaryTags;
  } catch (error) {
    console.error("Error creating summary tags:", error);
    return null;
  }
};

const createQuizTags = async (names, quizId) => {
  try {
    const tags = await Promise.all(names.map(name => createTag(name)));
    const quizTags = await Promise.all(tags.map(tag => prisma.quizTag.create({
      data: { tagId: tag.id, quizId },
    })));
    return quizTags;
  } catch (error) {
    console.error("Error creating quiz tags:", error);
    return null;
  }
};

const createDeckTags = async (names, deckId) => {
  try {
    const tags = await Promise.all(names.map(name => createTag(name)));
    const deckTags = await Promise.all(tags.map(tag => prisma.deckTag.create({
      data: { tagId: tag.id, deckId },
    })));
    return deckTags;
  } catch (error) {
    console.error("Error creating deck tags:", error);
    return null;
  }
};

const searchSummariesByTag = async (tagName) => {
  try {
    const tag = await prisma.tag.findUnique({ where: { name: tagName.toLowerCase() } });
    if (!tag) return [];
    return await prisma.summaryTag.findMany({
      where: { tagId: tag.id },
      include: { summary: { include: { user: true } } },
    });
  } catch (error) {
    console.error("Error searching summaries by tag:", error);
    return null;
  }
};

const searchQuizzesByTag = async (tagName) => {
  try {
    const tag = await prisma.tag.findUnique({ where: { name: tagName.toLowerCase() } });
    if (!tag) return [];
    return await prisma.quizTag.findMany({
      where: { tagId: tag.id },
      include: { quiz: { include: { user: true } } },
    });
  } catch (error) {
    console.error("Error searching quizzes by tag:", error);
    return null;
  }
};

const searchDecksByTag = async (tagName) => {
  try {
    const tag = await prisma.tag.findUnique({ where: { name: tagName.toLowerCase() } });
    if (!tag) return [];
    return await prisma.deckTag.findMany({
      where: { tagId: tag.id },
      include: { deck: { include: { user: true } } },
    });
  } catch (error) {
    console.error("Error searching decks by tag:", error);
    return null;
  }
};

const getAllTags = async () => {
  try {
    return await prisma.tag.findMany();
  } catch (error) {
    console.error("Error fetching all tags:", error);
    return [];
  }
};

module.exports = {
  createTag,
  getTagsByProjectId,
  searchProjectsByTag,
  createSummaryTag,
  createQuizTag,
  createDeckTag,
  createSummaryTags,
  createQuizTags,
  createDeckTags,
  searchSummariesByTag,
  searchQuizzesByTag,
  searchDecksByTag,
  getAllTags,
};
