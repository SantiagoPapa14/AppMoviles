const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getFollowData = async (userId, profileUserId) => {
  try {
    const isFollowing = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: profileUserId,
        },
      },
    });

    const followersCount = await prisma.follows.count({
      where: {
        followingId: profileUserId,
      },
    });

    const followingCount = await prisma.follows.count({
      where: {
        followerId: profileUserId,
      },
    });

    return {
      isFollowing: !!isFollowing,
      followersCount,
      followingCount,
    };
  } catch (error) {
    console.error("Error fetching follow data:", error);
    return null;
  }
};

const getFollowers = async (userId) => {
  try {
    const followers = await prisma.follows.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: true,
      },
    });
    return followers;
  } catch (error) {
    console.error("Error fetching followers:", error);
    return null;
  }
};

const generateSubscription = async (userId, followingId) => {
  try {
    const subscription = await prisma.follows.create({
      data: {
        followerId: userId,
        followingId: followingId,
      },
    });
    return subscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
    return null;
  }
};

const deleteSubscription = async (userId, followingId) => {
  try {
    const subscription = await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId,
        },
      },
    });
    return subscription;
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return null;
  }
};

const getFollowingIds = async (userId) => {
  try {
    const followingIds = await prisma.follows.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    return followingIds.map((follow) => follow.followingId);
  } catch (error) {
    console.error("Error fetching following IDs:", error);
    return [];
  }
};
module.exports = {
  getFollowData,
  generateSubscription,
  deleteSubscription,
  getFollowingIds,
  getFollowers,
};

