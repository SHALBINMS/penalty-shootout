const express = require("express");
const router = express.Router();

const { saveScore } = require("../controllers/scoreController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, saveScore);

module.exports = router;
