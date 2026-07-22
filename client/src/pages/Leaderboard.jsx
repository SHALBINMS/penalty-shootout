import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/leader.css";

const MEDAL_FORMS = ["Gold form", "Silver form", "Bronze form"];

function Leaderboard() {
  const [scores, setScores] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    axios
      .get("http://localhost:5000/api/scores/leaderboard")
      .then((response) => {
        if (isMounted) setScores(response.data);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    // Do not update the page if the leaderboard request finishes after navigation.
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="ranking-page">
      <header>
        <span>World Nights Series</span>
        <h1>
          Global <b>ranking</b>
        </h1>
        <p>The players who keep their nerve when it matters.</p>
      </header>

      <section className="ranking-list">
        {isLoading ? (
          <div className="rank-skeleton">Loading the scoreboard...</div>
        ) : scores.length ? (
          scores.map((item, index) => (
            <article className={`rank-card top-${index + 1}`} key={item._id}>
              <span className="rank-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="rank-avatar">
                {item.user?.name?.slice(0, 1) || "P"}
              </span>
              <div>
                <b>{item.user?.name || "Player"}</b>
                <small>
                  {index < MEDAL_FORMS.length
                    ? MEDAL_FORMS[index]
                    : "Penalty specialist"}
                </small>
              </div>
              <strong>{item.score}</strong>
            </article>
          ))
        ) : (
          <div className="rank-empty">
            <b>01</b>
            <p>No scores on the board yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Leaderboard;
