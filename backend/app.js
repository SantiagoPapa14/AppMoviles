const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 3000;
const authLib = require("./lib/authLib");
const { createSummary, getUserSummaries } = require("./lib/summaryRepository");
const { createQuiz, getUserQuizzes } = require("./lib/quizRepository");
const { updateUser, updatePicture } = require("./lib/userRepository");
const e = require("express");
const { createDeck, getUserDecks } = require("./lib/deckRepository");
const { hash } = require("bcrypt");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile_pictures/");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Extract file extension
    // cb(null, req.userData.userId + fileExtension); // Name the file with a unique suffix
    cb(null, req.userData.userId + ".jpg");
  },
});

const upload = multer({ storage: storage });

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);

app.get("/", authLib.validateAuthorization, (req, res) => {
  const message = "Welcome to the secret backend " + req.userData.username;
  res.send(message);
});

//Login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }

    const token = await authLib.loginUser(email, password);
    if (token === false) {
      res.status(401).json({
        message: "Invalid credentials",
      });
    } else {
      res.status(200).json({
        message: "Login successful!",
        token: token,
      });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//Register user
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    if (!email || !password || !username) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }

    const token = await authLib.registerUser(email, username, password, name);

    res.status(200).json({
      message: "Register successful!",
      token: token,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
});

//Get user data
app.get("/user/:id?", authLib.validateAuthorization, (req, res) => {
  if (req.params.id) {
    //TODO: Para cuando necesitemos ver los datos de otros usuarios.
    res.json({
      message: "Functionality not yet implemented!",
    });
  } else {
    delete req.userData.hashedPassword;
    res.json(req.userData);
  }
});

app.get("/user", authLib.validateAuthorization, (req, res) => {
  res.json(req.userData);
});

app.patch("/user", authLib.validateAuthorization, async (req, res) => {
  const { email, username, password, name } = req.body;

  if (!email && !username && !password && !name) {
    res.status(400).json({
      message: "Please provide email and password",
    });
    return;
  }
  const hashPassword = await hash(req.body.password, 10);
  const user = await updateUser(
    req.userData.userId,
    email,
    username,
    hashPassword,
    name
  );
  const newToken = await authLib.loginUser(user.email, req.body.password);
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
});

app.post(
  "/upload-profile-picture",
  authLib.validateAuthorization,
  upload.single("profile_picture"),
  async (req, res) => {
    try {
      res.json({ message: "Profile picture uploaded successfully" });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ message: "Error uploading profile picture" });
    }
  }
);

app.use("/uploads", express.static("uploads"));

app.post("/summaries", authLib.validateAuthorization, async (req, res) => {
  const { title, subject, summary } = req.body;

  if (!title || !subject || !summary) {
    res.status(400).json({
      message: "Please provide title, subject and summary",
    });
    return;
  }

  try {
    const newSummary = await createSummary(
      summary,
      title,
      subject,
      req.userData.userId
    );
    res.status(200).json({
      message: "Summary created successfully!",
      summary: newSummary,
    });
  } catch (err) {
    res.status(500).json(err.message);
    console.log(err.message);
  }
});

app.post("/quiz", authLib.validateAuthorization, async (req, res) => {
  try {
    const { title, questions } = req.body;
    if (!title || !questions) {
      res.status(400).json({
        message: "Please provide title and questions",
      });
      return;
    }
    const newQuiz = await createQuiz({ title, questions }, req.userData.userId);
    res.status(200).json({
      message: "Quiz created successfully!",
      quiz: newQuiz,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.post("/deck", authLib.validateAuthorization, async (req, res) => {
  try {
    const { title, flashcards } = req.body;
    if (!title || !flashcards) {
      res.status(400).json({
        message: "Please provide title and flashcards",
      });
      return;
    }
    const newDeck = await createDeck(
      { title, flashcards },
      req.userData.userId
    );
    res.status(200).json({
      message: "Deck created successfully!",
      deck: newDeck,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.get("/user-content", authLib.validateAuthorization, async (req, res) => {
  try {
    const userId = req.userData.userId;
    const summaries = await getUserSummaries(userId);
    const quizzes = await getUserQuizzes(userId);
    const decks = await getUserDecks(userId);

    res.status(200).json({
      summaries: summaries,
      quizzes: quizzes,
      decks: decks,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user content",
      error: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
