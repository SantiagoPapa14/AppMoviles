const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
router.use(express.json());

const authLib = require("../lib/authLib");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (req.route.path === "/upload-profile-picture") {
      uploadPath = "uploads/profile_pictures/";
    } else if (req.route.path === "/upload-summary-attachment") {
      uploadPath = "uploads/summary_attachments/";
    } else {
      return cb(new Error("Invalid upload route"));
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    let filename;
    if (req.route.path === "/upload-profile-picture") {
      const extension = path.extname(file.originalname);
      filename = req.userData.userId + extension;
    } else if (req.route.path === "/upload-summary-attachment") {
      filename = Date.now() + "-" + file.originalname; // Use unique filename
    } else {
      return cb(new Error("Invalid upload route"));
    }
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.post(
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
  },
);

router.post(
  "/upload-summary-attachment",
  authLib.validateAuthorization,
  upload.single("summary_attachment"),
  async (req, res) => {
    try {
      const uploadedFilename = req.file.filename;
      res.json({ message: "Summary attachment uploaded successfully" });
    } catch (error) {
      console.error("Error uploading summary attachment:", error);
      res.status(500).json({ message: "Error uploading summary attachment" });
    }
  },
);

module.exports = router;
