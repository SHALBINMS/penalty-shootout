const Score = require("../models/Score");

const saveScore = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getLeaderboard = async (req, res, next) => {
  try {
    const scores = await Score.find()
      .sort({ score: -1 })
      .limit(10)
      .populate("user", "name");

    res.json(scores);
  } catch (error) {
    next(error);
  }
};

const getMyStats = async (req, res, next) => {
  try {
    const myScores = await Score.find({ user: req.user.id });
    const totalGames = myScores.length;
    const scoreValues = myScores.map((scoreEntry) => scoreEntry.score);
    const highestScore = scoreValues.length > 0 ? Math.max(...scoreValues) : 0;
    const totalGoals = myScores.reduce(
      (total, scoreEntry) => total + scoreEntry.score,
      0,
    );
    const averageScore = totalGames > 0 ? totalGoals / totalGames : 0;

    res.json({
      totalGames,
      gamesPlayed: totalGames,
      highestScore,
      averageScore,
      totalGoals,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  saveScore,
  getLeaderboard,
  getMyStats,
};
