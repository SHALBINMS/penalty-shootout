import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/stats.css";

const STAT_CARDS = [
  ["Matches played", "gamesPlayed", "MP"],
  ["Goals scored", "totalGoals", "GL"],
  ["Best score", "highestScore", "HI"],
  ["Average finish", "averageScore", "AV"],
];

function Stats() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setErrorMessage("");

    const loadStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/scores/mystats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (isMounted) {
          setStats(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setStats(null);
          setErrorMessage(
            error.code === "ERR_NETWORK"
              ? "You appear to be offline. Please check your connection and try again."
              : "We could not load your stats right now.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatStatValue = (key) => {
    if (!stats) return "--";

    if (key === "averageScore") {
      return Number(stats.averageScore ?? 0).toFixed(2);
    }

    if (key === "gamesPlayed") {
      return stats.gamesPlayed ?? stats.totalGames ?? 0;
    }

    return stats[key] ?? 0;
  };

  return (
    <main className="stats-container">
      <span>Performance centre</span>
      <h1>My statistics</h1>
      <p>Every shootout leaves a mark. This is yours.</p>

      <section className="stats-grid">
        {STAT_CARDS.map(([label, key, icon]) => (
          <article className="stat-card" key={key}>
            <i>{icon}</i>
            <span>{label}</span>
            <strong>{formatStatValue(key)}</strong>
            <em />
          </article>
        ))}
      </section>

      {isLoading && (
        <div className="stats-loading" aria-live="polite">
          <span className="stats-spinner" aria-hidden="true" />
          Preparing your match report...
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="stats-loading stats-error" aria-live="polite">
          {errorMessage}
        </div>
      )}
    </main>
  );
}

export default Stats;
