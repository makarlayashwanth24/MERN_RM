const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { analyzeResume } = require("../controllers/resumeController");

const router = express.Router();

router.post("/analyze-resume", protect, analyzeResume);

module.exports = router;