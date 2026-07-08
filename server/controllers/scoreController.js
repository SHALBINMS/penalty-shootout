const Score = require("../models/Score");

const saveScore = async (req, res) => {
  const { score, attempts } = req.body;

  if (score === undefined || attempts === undefined) {
    return res.status(400).json({
      message: "Score and attempts are required",
    });
  }

  const newScore = await Score.create({
    user: req.user.id,
    score,
    attempts,
  });

  res.status(201).json(newScore);
};

module.exports = {
  saveScore,
};
