import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Game.css";

function Game() {
  const [score, setScore] = useState(0);
  const [result, setResult] = useState("");
  const [goalkeeperMove, setGoalkeeperMove] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [playerMove, setPlayerMove] = useState("");
  const [isGoal, setIsGoal] = useState(null);
  const [history, setHistory] = useState([]);

  const directions = ["left", "center", "right"];

  // horizontal travel distance for the ball/keeper per direction
  const shotOffsets = { left: -95, center: 0, right: 95 };
  // tighter offset used for the small net-ripple inside the goal frame
  const netOffsets = { left: -34, center: 0, right: 34 };
  // keeper tilt while diving
  const keeperTilt = { left: -16, center: 0, right: 16 };

  const shoot = (playerDirection) => {
    if (attempts >= 5) {
      return;
    }
    setPlayerMove(playerDirection);
    setAttempts((prev) => prev + 1);

    const randomIndex = Math.floor(Math.random() * directions.length);
    const goalkeeperDirection = directions[randomIndex];
    setGoalkeeperMove(goalkeeperDirection);

    if (playerDirection === goalkeeperDirection) {
      setResult("SAVED!");
      setIsGoal(false);
      setHistory((prev) => [...prev, { outcome: "saved", label: "🧤 Saved" }]);
    } else {
      setResult("GOAL!");
      setIsGoal(true);
      setScore((prev) => prev + 1);
      setHistory((prev) => [...prev, { outcome: "goal", label: "⚽ Goal" }]);
    }
  };

  const restartGame = () => {
    setScore(0);
    setAttempts(0);
    setResult("");
    setPlayerMove("");
    setGoalkeeperMove("");
    setIsGoal(null);
    setHistory([]);
  };

 const saveScore = async () => {
   try {
     const token = localStorage.getItem("token");

     await axios.post(
       "http://localhost:5000/api/scores",
       {
         score,
         attempts,
       },
       {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       },
     );

     console.log("✅ Score saved successfully");
   } catch (error) {
     console.error("❌ Failed to save score", error);
   }
 };

 useEffect(() => {
   if (attempts === 5) {
     saveScore();
   }
 }, [attempts]);
 
  return (
    <div className="game-container">
      <span className="eyebrow">Sudden Death · Best of 5</span>
      <h1 className="title">Penalty Shootout</h1>

      {/* Scoreboard */}
      <div className="scoreboard">
        <div className="score-card">
          <h3>Score</h3>
          <p>{score}</p>
        </div>

        <div className="score-card">
          <h3>Attempts</h3>
          <p>{attempts}/5</p>
        </div>
      </div>

      {/* Football Field */}
      <div className="field">
        <div className={`goal ${isGoal === true ? "scored" : ""}`}>
          🥅
          {isGoal === true && (
            <span
              key={`ripple-${attempts}`}
              className="net-ripple"
              style={{ "--gx": `${netOffsets[playerMove] ?? 0}px` }}
            />
          )}
        </div>

        <div className="penalty-area">
          <div
            key={`keeper-${attempts}`}
            className={`goalkeeper ${goalkeeperMove ? "diving" : ""}`}
            style={{
              "--x": `${shotOffsets[goalkeeperMove] ?? 0}px`,
              "--rot": `${keeperTilt[goalkeeperMove] ?? 0}deg`,
            }}
          >
            🧤
          </div>

          <div className="ball-wrap">
            <div
              key={`ball-${attempts}`}
              className={`ball ${
                isGoal === true
                  ? "flying-goal"
                  : isGoal === false
                    ? "flying-save"
                    : ""
              }`}
              style={{ "--x": `${shotOffsets[playerMove] ?? 0}px` }}
            >
              ⚽
            </div>

            {isGoal === false && (
              <div
                key={`impact-${attempts}`}
                className="impact-burst"
                style={{ "--x": `${shotOffsets[playerMove] ?? 0}px` }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <button onClick={() => shoot("left")} disabled={attempts >= 5}>
          ⬅️ Left
        </button>

        <button onClick={() => shoot("center")} disabled={attempts >= 5}>
          ⬆️ Center
        </button>

        <button onClick={() => shoot("right")} disabled={attempts >= 5}>
          ➡️ Right
        </button>
      </div>

      {/* Result */}
      <div
        className={`result-card ${isGoal === true ? "goal" : ""} ${
          isGoal === false ? "saved" : ""
        }`}
      >
        <h3>Match Result</h3>
        <p>{result || "Take your first shot!"}</p>

        {playerMove && (
          <>
            <p>
              You shot <strong>{playerMove}</strong> · Keeper dove{" "}
              <strong>{goalkeeperMove}</strong>
            </p>
          </>
        )}
      </div>

      {/* Shot History */}
      <div className="history-card">
        <h3>Match Timeline</h3>

        {history.length === 0 ? (
          <p>No shots yet — the pitch is waiting.</p>
        ) : (
          <ul>
            {history.map((item, index) => (
              <li key={index} data-outcome={item.outcome}>
                Shot {index + 1}: {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Game Over */}
      {attempts >= 5 && (
        <div className="game-over">
          <h2>Full Time</h2>
          <p>You scored {score} out of 5 penalties.</p>
          <button onClick={restartGame}>🔄 Play Again</button>
        </div>
      )}
    </div>
  );
}

export default Game;
