const express = require("express");
const router = express.Router();
router.use(express.json());

const authLib = require("../lib/authLib");

const {
  createSummary,
  getSummaryById,
  EditSummary,
  deleteSummary,
} = require("../lib/summaryRepository");

router.post("/", authLib.validateAuthorization, async (req, res) => {
  const { title, subject, summary } = req.body;

  if (!title || !subject || !summary) {
    res.status(400).json({
      message: "Please provide title, subject and summary",
    });
    return;
  }

  try {
    const newSummary = await createSummary(
      title,
      subject,
      summary,
      req.userData.userId,
    );
    res.status(200).json({
      message: "Summary created successfully!",
      summary: newSummary,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
    console.log(err.message);
  }
});

router.patch("/:id", authLib.validateAuthorization, async (req, res) => {
  const { title, subject, summary } = req.body;

  if (!title || !subject || !summary) {
    res.status(400).json({
      message: "Please provide title, subject and summary",
    });
    return;
  }
  try {
    const newSummary = await EditSummary(
      title,
      subject,
      summary,
      req.params.id,
    );

    res.status(200).json({
      message: "Summary updated successfully!",
      summary: newSummary,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
    console.log(err.message);
  }
});

router.get("/:id", authLib.validateAuthorization, async (req, res) => {
  try {
    const summary = await getSummaryById(req.params.id);
    if (!summary) {
      res.status(404).json({ message: "Summary not found" });
      return;
    }
    res.status(200).json(summary);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to fetch summary", error: err.message });
  }
});

router.delete("/:id", authLib.validateAuthorization, async (req, res) => {
  try {
    const summaryId = req.params.id;
    const deletedSummary = await deleteSummary(summaryId);
    if (!deletedSummary) {
      res.status(404).json({ message: "Summary not found" });
      return;
    }
    res.status(200).json({ message: "Summary deleted successfully!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to delete summary", error: err.message });
  }
});

module.exports = router;
