const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createUser(email, username, password, name) {
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        hashedPassword: password,
        name: name,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getProfileById(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function updateUser(userId, email, username, password, name) {
  try {
    const user = await prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        email: email,
        username: username,
        hashedPassword: password,
        name: name,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  createUser,
  getUserByEmail,
  updateUser,
  getProfileById
};
