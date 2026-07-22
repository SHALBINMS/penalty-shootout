import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/Home.css";

function Home() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);

      try {
        const token = localStorage.getItem("token");
        const [statsResponse, leadersResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/scores/mystats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/scores/leaderboard"),
        ]);

        if (isMounted) {
          setStats(statsResponse.data);
          setLeaders(leadersResponse.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    ["Games played", stats?.gamesPlayed ?? stats?.totalGames ?? 0, "GP"],
    ["Total goals", stats?.totalGoals ?? 0, "GL"],
    ["Best shootout", stats?.highestScore ?? 0, "HI"],
    [
      "Average score",
      stats ? Number(stats.averageScore ?? 0).toFixed(2) : "0.00",
      "AV",
    ],
  ];

  return (
    <main className="home">
      <section className="home-hero">
        <div>
          <span className="section-tag">World Cup 2026 / Matchday</span>
          <h1>
            Own the <b>world stage.</b>
          </h1>
          <p>
            Five kicks separate a good night from a legendary one. The stadium
            is waiting{user?.name ? `, ${user.name}` : ""}.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" to="/game">
              Enter the pitch
            </Link>
            <Link className="quiet-action" to="/leaderboard">
              View rankings
            </Link>
          </div>
        </div>
        <div className="hero-ball">
          <i />
          <i />
          <i />
        </div>
        <div className="hero-lines" />
      </section>

      <section className="dashboard">
        <div className="section-heading">
          <div>
            <span className="section-tag">Performance</span>
            <h2>Your season</h2>
          </div>
          <Link to="/stats">All statistics</Link>
        </div>
        <div className="dashboard-grid">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <article className="dash-card" key={`loading-${index}`}>
                  <i>{"•"}</i>
                  <span>Loading</span>
                  <strong>--</strong>
                  <em />
                </article>
              ))
            : cards.map(([label, value, icon]) => (
                <article className="dash-card" key={label}>
                  <i>{icon}</i>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <em />
                </article>
              ))}
        </div>
      </section>

      <section className="leader-preview">
        <div className="section-heading">
          <div>
            <span className="section-tag">Global ranking</span>
            <h2>Leading scorers</h2>
          </div>
          <Link to="/leaderboard">Full table</Link>
        </div>
        <div className="leader-list">
          {isLoading ? (
            <div className="empty-state">
              <b>02</b>
              <p>Loading the latest scores…</p>
            </div>
          ) : leaders.length ? (
            leaders.slice(0, 3).map((player, index) => (
              <div className="leader-row" key={player._id}>
                <span className={`rank r${index + 1}`}>0{index + 1}</span>
                <span className="avatar">
                  {player.user?.name?.slice(0, 1) || "P"}
                </span>
                <b>{player.user?.name || "Player"}</b>
                <small>Best score</small>
                <strong>{player.score}</strong>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <b>01</b>
              <p>The ranking board is ready for its first name.</p>
              <Link to="/game">Take the first shot</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;
