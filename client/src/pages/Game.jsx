import { useState } from "react";
function Game() {
  const [score, setScore] = useState(0);

  const [result, setResult] = useState("");

  const [goalkeeperMove, setGoalkeeperMove] = useState("");

  const [attempts, setAttempts] = useState(0);

  const directions = ["left", "center", "right"];

 const shoot = (playerDirection) => {
  if (attempts >= 5) {
    return;
  }
   setAttempts((prev) => prev + 1);
   const randomIndex = Math.floor(Math.random() * directions.length);

   const goalkeeperDirection = directions[randomIndex];
   setGoalkeeperMove(goalkeeperDirection);

   console.log("Player:", playerDirection);
   console.log("Goalkeeper:", goalkeeperDirection);


   if (playerDirection === goalkeeperDirection) {
     setResult("🧤 SAVED!");
   } else {
     setResult("⚽ GOAL!");
     setScore((prevScore) => prevScore + 1);
   }
 };

 const restartGame = () => {
   setScore(0);
   setAttempts(0);
   setResult("");
   setGoalkeeperMove("");
 };

  return (
    <div>
      <h1>⚽ Penalty Shootout</h1>

      <h2>Score: {score}</h2>
      <h2>Attempts: {attempts} / 5</h2>

      <p>Choose where to shoot:</p>

      <button onClick={() => shoot("left")}>⬅️ Left</button>

      <button onClick={() => shoot("center")}>⬆️ Center</button>

      <button onClick={() => shoot("right")}>➡️ Right</button>

      <hr />

      <p>{result || "Result will appear here..."}</p>
      {goalkeeperMove && <p>Goalkeeper dived: {goalkeeperMove}</p>}

      {attempts >= 5 && (
        <>
          <h2>🎉 Game Over!</h2>

          <button onClick={restartGame}>🔄 Play Again</button>
        </>
      )}
    </div>
  );
}

export default Game;
