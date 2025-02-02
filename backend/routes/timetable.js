const express = require("express");
const router = express.Router();
const authLib = require("../lib/authLib");
const { updateTimetable, getTimetable } = require("../lib/timetableRepository");
router.use(express.json());

router.patch("/update", authLib.validateAuthorization, async (req, res) => {
  try {
    console.log(req.body); // Log the request body to debug
    const { userId, timetable } = req.body;
    console.log(userId)
    await updateTimetable(userId, timetable);
    
    res.status(200).json({ message: "Timetable updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update timetable", error: err.message });
  }
});

router.get("/:userId", authLib.validateAuthorization, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const timetable = await getTimetable(userId);
    res.status(200).json(timetable);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch timetable", error: err.message });
  }
});

module.exports = router;
