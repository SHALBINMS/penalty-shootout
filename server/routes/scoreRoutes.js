const express = require("express");
const router = express.Router();

const {
  saveScore,
  getLeaderboard,
  getMyStats,
} = require("../controllers/scoreController");
const protect = require("../middleware/authMiddleware");
const { validate, scoreSchema } = require("../middleware/validateRequest");

router.post("/", protect, validate(scoreSchema), saveScore);

router.get("/leaderboard", getLeaderboard);

router.get("/mystats", protect, getMyStats);

module.exports = router;
