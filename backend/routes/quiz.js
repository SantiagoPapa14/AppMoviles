const express = require("express");
const router = express.Router();
router.use(express.json());

const authLib = require("../lib/authLib");

const {
  createQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} = require("../lib/quizRepository");

router.post("/", authLib.validateAuthorization, async (req, res) => {
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
    console.log(err);
    res.status(500).json(err.message);
  }
});

router.get("/:id", authLib.validateAuthorization, async (req, res) => {
  try {
    const quiz = await getQuizById(req.params.id);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }
    res.status(200).json(quiz);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to fetch quiz", error: err.message });
  }
});

router.patch("/:id", authLib.validateAuthorization, async (req, res) => {
  try {
    const { title, questions } = req.body;
    if (!title || !questions) {
      res.status(400).json({
        message: "Please provide title and questions",
      });
      return;
    }
    const updatedQuiz = await updateQuiz(req.params.id, { title, questions });
    if (!updatedQuiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }
    res.status(200).json({
      message: "Quiz updated successfully!",
      quiz: updatedQuiz,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
});

router.delete("/:id", authLib.validateAuthorization, async (req, res) => {
  try {
    const quizId = req.params.id;
    const deletedQuiz = await deleteQuiz(quizId);
    if (!deletedQuiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }
    res.status(200).json({ message: "Quiz deleted successfully!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to delete quiz", error: err.message });
  }
});

module.exports = router;
