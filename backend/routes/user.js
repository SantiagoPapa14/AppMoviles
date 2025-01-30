const express = require("express");
const router = express.Router();
router.use(express.json());

const authLib = require("../lib/authLib");

const { updateUser, getProfileById } = require("../lib/userRepository");
const { getUserSummaries } = require("../lib/summaryRepository");
const { getUserQuizzes } = require("../lib/quizRepository");
const { getUserDecks } = require("../lib/deckRepository");

const {
  getFollowers,
  generateSubscription,
  deleteSubscription,
  getFollowingIds,
  getFollowData,
} = require("../lib/followerRepository");

const { hash } = require("bcrypt");
const bcrypt = require("bcrypt");

router.get("/", authLib.validateAuthorization, async (req, res) => {
  const followers = await getFollowers(req.userData.userId);
  res.json({ followerCount: followers.length, ...req.userData });
});

//Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }
    console.log("Email:", email.toLowerCase());
    console.log("Password:", password);
    const [token, userId] = await authLib.loginUser(
      email.toLowerCase(),
      password,
    );

    if (token === false) {
      res.status(401).json({
        message: "Invalid credentials",
      });
    } else {
      res.status(200).json({
        message: "Login successful!",
        token: token,
        userId: userId,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

//Register user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    if (!email || !password || !username) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }

    const token = await authLib.registerUser(
      email.toLowerCase(),
      username,
      password,
      name,
    );

    res.status(200).json({
      message: "Register successful!",
      token: token,
    });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    res.status(500).json(err.message);
  }
});

router.patch("/", authLib.validateAuthorization, async (req, res) => {
  let { email, username, password, name, currentPassword } = req.body;

  if (!email && !username && !password && !name) {
    res.status(400).json({
      message: "Please provide email and password",
    });
    return;
  }

  if (!password) {
    password = currentPassword;
  }

  if (
    currentPassword &&
    req.userData.hashedPassword &&
    (await bcrypt.compare(currentPassword, req.userData.hashedPassword))
  ) {
    const hashPassword = await hash(password, 10);
    const user = await updateUser(
      req.userData.userId,
      email.toLowerCase(),
      username,
      hashPassword,
      name,
    );

    const [newToken, userId] = await authLib.loginUser(
      user.email.toLowerCase(),
      password,
    );
    console.log("New token:", newToken);
    if (!user) {
      res.status(500).json({
        message: "User not found",
      });
    } else {
      res.status(200).json({
        message: "User updated successfully!",
        user: user,
        newToken: newToken,
      });
    }
  } else {
    res.status(401).json({
      message: "Invalid credentials, cannot update user",
    });
  }
});

//SUSCRIPTIONS ENDPOINTS

router.post(
  "/subscribe/:id",
  authLib.validateAuthorization,
  async (req, res) => {
    try {
      const userId = req.userData.userId;
      const followingId = parseInt(req.params.id, 10);

      if (userId === followingId) {
        res.status(400).json({ message: "You cannot subscribe to yourself" });
        return;
      }

      const followData = await generateSubscription(userId, followingId);

      res.status(200).json({
        message: "Subscribed successfully!",
        followData: followData,
      });
    } catch (err) {
      console.log(err);
      console.error("Error subscribing to user:", err);
      res
        .status(500)
        .json({ message: "Failed to subscribe to user", error: err.message });
    }
  },
);

router.delete(
  "/unsubscribe/:id",
  authLib.validateAuthorization,
  async (req, res) => {
    try {
      const userId = req.userData.userId;
      const followingId = parseInt(req.params.id, 10);

      if (userId === followingId) {
        res.status(400).json({ message: "You cannot subscribe to yourself" });
        return;
      }

      const followData = await deleteSubscription(userId, followingId);

      res.status(200).json({
        message: "Subscribed successfully!",
        followData: followData,
      });
    } catch (err) {
      console.log(err);
      console.error("Error subscribing to user:", err);
      res
        .status(500)
        .json({ message: "Failed to subscribe to user", error: err.message });
    }
  },
);

router.get(
  "/following-projects",
  authLib.validateAuthorization,
  async (req, res) => {
    try {
      const userId = req.userData.userId;
      const followingIds = await getFollowingIds(userId);

      const summaries = [];
      const quizzes = [];
      const decks = [];

      for (const id of followingIds) {
        const userSummaries = await getUserSummaries(id);
        const userQuizzes = await getUserQuizzes(id);
        const userDecks = await getUserDecks(id);

        summaries.push(...userSummaries);
        quizzes.push(...userQuizzes);
        decks.push(...userDecks);
      }

      res.status(200).json({
        summaries: summaries,
        quizzes: quizzes,
        decks: decks,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Failed to fetch following projects",
        error: err.message,
      });
    }
  },
);

router.get("/user-content", authLib.validateAuthorization, async (req, res) => {
  try {
    const userId = req.userData.userId;
    const summaries = await getUserSummaries(userId);
    const quizzes = await getUserQuizzes(userId);
    const decks = await getUserDecks(userId);
    const followers = await getFollowData(userId, userId);

    res.status(200).json({
      summaries: summaries,
      quizzes: quizzes,
      decks: decks,
      deck: decks,
      followers: followers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch user content",
      error: err.message,
    });
  }
});

router.get(
  "/user-content/:id",
  authLib.validateAuthorization,
  async (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      const summaries = await getUserSummaries(userId);
      const quizzes = await getUserQuizzes(userId);
      const decks = await getUserDecks(userId);
      const profile = await getProfileById(userId);
      const followData = await getFollowData(req.userData.userId, userId);

      res.status(200).json({
        summaries: summaries,
        quizzes: quizzes,
        decks: decks,
        profile: profile,
        followData: followData,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Failed to fetch user content",
        error: err.message,
      });
    }
  },
);

module.exports = router;
