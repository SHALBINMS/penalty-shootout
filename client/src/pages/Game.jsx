/* The shot outcome is intentionally randomized inside a user-triggered handler. */
/* eslint-disable react-hooks/purity */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Ball, Goalkeeper, Player } from "../components/PitchArt";
import "../styles/game.css";

//////////////////////////////////////////////////
// Game Constants
//////////////////////////////////////////////////

const MAX_HISTORY_DOTS = 5;
const WINDUP_DURATION = 240;
const RESULT_DURATION = 900;
const METER_PERIOD = 1100; // ms — must match the .power-fill CSS animation duration
const IDEAL_POWER = 62; // sweet spot: best blend of pace and control
const MIN_FLIGHT = 300; // ms, a full-power screamer
const MAX_FLIGHT = 780; // ms, a gently side-footed shot

//////////////////////////////////////////////////
// Helpers (pure, outside component so they aren't recreated every render)
//////////////////////////////////////////////////

// Triangle wave 0 -> 100 -> 0, kept in sync with the CSS power bar.
function readPower(startedAt) {
  const elapsed = (performance.now() - startedAt) % METER_PERIOD;
  const t = elapsed / METER_PERIOD;
  const wave = t < 0.5 ? t * 2 : 2 - t * 2;
  return Math.round(wave * 100);
}

function columnOf(x) {
  return x < -0.33 ? -1 : x > 0.33 ? 1 : 0;
}

// More power = less time in the air. The ball always travels to exactly
// where you clicked — power changes how fast it gets there, not where.
function flightDurationFor(shotPower, x, y) {
  // The penalty spot is 11 m from goal. Add the horizontal and vertical
  // distance to the clicked target, then divide by a 54â€“126 km/h strike.
  const distance = Math.hypot(11, x * 3.66, (0.5 - y) * 2.44);
  const metresPerSecond = 15 + (shotPower / 100) * 20;
  const duration = (distance / metresPerSecond) * 1000;
  return Math.round(Math.max(MIN_FLIGHT, Math.min(MAX_FLIGHT, duration)));
}

function Game() {
  //////////////////////////////////////////////////
  // State
  //////////////////////////////////////////////////

  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [phase, setPhase] = useState("ready"); // ready | windup | flight
  const [target, setTarget] = useState({ x: 0, y: 0.35 });
  const [flightMs, setFlightMs] = useState(500);
  const [ballPower, setBallPower] = useState(50);
  const [keeper, setKeeper] = useState({ dir: "center", row: "mid" });
  const [result, setResult] = useState("READY");
  const [shotOutcome, setShotOutcome] = useState("READY");
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(
    () => Number(localStorage.getItem("ps_best_streak")) || 0,
  );
  const [roundOver, setRoundOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  //////////////////////////////////////////////////
  // Refs (authoritative counters + non-visual game state)
  //////////////////////////////////////////////////

  const timers = useRef([]);
  const meterStart = useRef(performance.now());
  const goalRef = useRef(null);
  const scoreRef = useRef(0);
  const attemptsRef = useRef(0);
  const keeperWeights = useRef({ "-1": 1, 0: 1, 1: 1 });

  const accuracy = attempts ? Math.round((score / attempts) * 100) : 0;
  const canShoot = phase === "ready" && !roundOver;

  //////////////////////////////////////////////////
  // Effects
  //////////////////////////////////////////////////

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  //////////////////////////////////////////////////
  // Small helpers
  //////////////////////////////////////////////////

  const delay = (callback, duration) => {
    timers.current.push(setTimeout(callback, duration));
  };

  const playSound = (name) => {
    window.dispatchEvent(new CustomEvent("penalty-sound", { detail: name }));
  };

  const saveScore = async (finalScore, finalAttempts) => {
    setIsSaving(true);

    try {
      await axios.post(
        "http://localhost:5000/api/scores",
        {
          score: Number(finalScore),
          attempts: Number(finalAttempts),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
    } catch (error) {
      console.error(
        "Failed to save score",
        error.response?.data || error.message,
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Keeper leans toward whichever side you've favoured, so spamming one
  // corner stops working — you have to actually mix your shots up.
  const pickKeeperColumn = () => {
    const w = keeperWeights.current;
    const total = w["-1"] + w["0"] + w["1"];
    let roll = Math.random() * total;
    for (const key of ["-1", "0", "1"]) {
      if (roll < w[key]) return Number(key);
      roll -= w[key];
    }
    return 0;
  };

  //////////////////////////////////////////////////
  // The shot itself: one click both aims (where you clicked in the goal)
  // and times the strike (power bar value at the moment you clicked).
  //////////////////////////////////////////////////

  const takeShot = (x, y) => {
    if (!canShoot) return;

    const shotPower = readPower(meterStart.current);

    // The ball always lands exactly where you clicked — power only changes
    // how fast it gets there (and, below, how hard it is for the keeper).
    const flightMs = flightDurationFor(shotPower, x, y);

    const column = columnOf(x);
    keeperWeights.current[String(column)] += 1;

    const diveColumn = pickKeeperColumn();
    const diveRow = y < 0.42 ? "high" : "low";
    const nearFrame = Math.abs(x) > 0.86 || y > 0.9;
    const topCorner = Math.abs(x) > 0.55 && y < 0.3;
    const hitPost = nearFrame && Math.random() < 0.14;

    let saved = false;
    if (!hitPost && diveColumn === column) {
      let saveChance = 0.52;
      if (topCorner) saveChance -= 0.28; // corners are hard to reach in time
      if (shotPower > 82) saveChance -= 0.2; // pace beats reaction speed
      if (shotPower < 40) saveChance += 0.22; // soft shots are easy pickings
      saveChance += Math.min(0.15, streak * 0.015); // keeper tightens up on a hot streak
      saved = Math.random() < Math.max(0.06, Math.min(0.9, saveChance));
    }

    const outcome = hitPost ? "POST" : saved ? "SAVED" : "GOAL";
    const keeperDir =
      diveColumn === -1 ? "left" : diveColumn === 1 ? "right" : "center";

    setTarget({ x, y });
    setFlightMs(flightMs);
    setBallPower(shotPower);
    setKeeper({ dir: keeperDir, row: diveRow });
    setPhase("windup");
    setResult("STRIKE");
    setShotOutcome(outcome);
    playSound("kick");

    delay(() => setPhase("flight"), WINDUP_DURATION);

    delay(() => {
      const goal = outcome === "GOAL";

      scoreRef.current += goal ? 1 : 0;
      attemptsRef.current += 1;

      setResult(goal && shotPower > 88 ? "SCREAMER" : outcome);
      setHistory((current) => [...current, { goal, outcome }]);
      setScore(scoreRef.current);
      setAttempts(attemptsRef.current);

      if (goal) {
        setStreak((current) => {
          const next = current + 1;
          if (next > best) {
            setBest(next);
            localStorage.setItem("ps_best_streak", String(next));
          }
          return next;
        });
      } else {
        setStreak(0);
      }

      playSound(goal ? "goal" : outcome === "POST" ? "post" : "save");

      const roundEnded = outcome === "SAVED";

      if (roundEnded) {
        saveScore(scoreRef.current, attemptsRef.current);
      }
      if (roundEnded) {
        setRoundOver(true);
      }
    }, WINDUP_DURATION + flightMs);

    delay(
      () => setPhase("ready"),
      WINDUP_DURATION + flightMs + RESULT_DURATION,
    );
  };

  const shoot = (event) => {
    if (!canShoot || !goalRef.current) return;

    const rect = goalRef.current.getBoundingClientRect();
    const px = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width),
    );
    const py = Math.max(
      0,
      Math.min(1, (event.clientY - rect.top) / rect.height),
    );
    takeShot(px * 2 - 1, py);
  };

  const restart = () => {
    scoreRef.current = 0;
    attemptsRef.current = 0;
    keeperWeights.current = { "-1": 1, 0: 1, 1: 1 };
    setScore(0);
    setAttempts(0);
    setPhase("ready");
    setResult("READY");
    setShotOutcome("READY");
    setHistory([]);
    setStreak(0);
    setRoundOver(false);
    setIsSaving(false);
    setTarget({ x: 0, y: 0.35 });
    setBallPower(50);
  };

  //////////////////////////////////////////////////
  // Rendering
  //////////////////////////////////////////////////

  return (
    <main
      className={`match-page ${result.includes("GOAL") || result === "SCREAMER" ? "goal-scene" : ""}`}
    >
      <header className="match-header">
        <span>World Cup 2026</span>
        <div>
          <h1>
            Penalty <b>Cup 2026</b>
          </h1>
          <p>Aim with your click. Time it with the power bar.</p>
        </div>
        <em>
          <i />
          Tournament live
        </em>
      </header>

      <section className="scoreboard">
        <div className="team">
          <i>P</i>Home nation
        </div>
        <div className="score">
          <b>
            {score}
            <i>:</i>0
          </b>
          <span>World Cup shootout</span>
        </div>
        <div className="team away">
          Visiting side<i>G</i>
        </div>
      </section>

      <section className="match-meta">
        <p>
          Attempts <b>{attempts}</b>
        </p>
        <p>
          Accuracy <b>{accuracy}%</b>
        </p>
        <p className={streak > 1 ? "flame" : ""}>
          Streak{" "}
          <b>
            {streak}
            {streak > 1 ? " 🔥" : ""}
          </b>
        </p>
        <p>
          Best <b>{best}</b>
        </p>
        <div>
          {Array.from({ length: MAX_HISTORY_DOTS }, (_, index) => {
            const attempt = history[history.length - 1 - index];
            return (
              <i
                className={attempt ? (attempt.goal ? "goal" : "saved") : ""}
                key={`${attempt?.outcome || "empty"}-${index}`}
              />
            );
          })}
        </div>
      </section>

      <section className="stadium">
        <div className="crowd" />
        <div className="lights">
          <i />
          <i />
        </div>
        <div className="goal">
          <i />
          {(result.includes("GOAL") || result === "SCREAMER") && (
            <b
              style={{
                "--x": `${target.x * 50}%`,
                "--gy": `${target.y * 100}%`,
              }}
            />
          )}
        </div>
        <div
          className="goal-target"
          ref={goalRef}
          onClick={shoot}
          data-active={canShoot}
        >
          <i className="zone-line v1" />
          <i className="zone-line v2" />
          <i className="zone-line h1" />
        </div>
        <div className="pitch-lines" />
        <Goalkeeper
          phase={phase}
          outcome={shotOutcome}
          direction={keeper.dir}
          row={keeper.row}
        />
        <Player phase={phase} />
        <Ball
          phase={phase}
          outcome={shotOutcome}
          direction={keeper.dir}
          x={target.x}
          y={target.y}
          flightMs={flightMs}
          power={ballPower}
        />
        {phase === "flight" && shotOutcome !== "READY" && (
          <span
            className={`shot-call ${shotOutcome === "GOAL" ? "is-goal" : "is-save"}`}
          >
            {shotOutcome === "GOAL" ? "GOAL!" : "SAVED!"}
          </span>
        )}
        <small>World Cup 2026 / Night session</small>
      </section>

      <section className="shot-console">
        <div className="power-meter">
          <span>Power</span>
          <div className="power-track">
            <i className="power-sweet" style={{ left: `${IDEAL_POWER}%` }} />
            <div className={`power-fill ${canShoot ? "running" : "paused"}`} />
          </div>
        </div>
        <div
          className="direction-controls"
          role="group"
          aria-label="Choose shot direction"
        >
          <button disabled={!canShoot} onClick={() => takeShot(-0.62, 0.36)}>
            Left
          </button>
          <button disabled={!canShoot} onClick={() => takeShot(0, 0.42)}>
            Centre
          </button>
          <button disabled={!canShoot} onClick={() => takeShot(0.62, 0.36)}>
            Right
          </button>
        </div>
        <p className="hint">
          Tap or click anywhere in the goal to strike — corners are risky, the
          middle band is safest.
        </p>
      </section>

      <section className="timeline">
        <span>Shot timeline</span>
        <div>
          {history.length ? (
            history.map((attempt, index) => (
              <p className={attempt.goal ? "goal" : "saved"} key={index}>
                <b>0{index + 1}</b>
                {attempt.outcome === "POST"
                  ? "Off the post"
                  : attempt.goal
                    ? "Goal"
                    : "Saved"}
              </p>
            ))
          ) : (
            <p>The first whistle is yours.</p>
          )}
        </div>
      </section>

      {roundOver && (
        <div className="game-over">
          <span>Full time</span>
          <h2>{score >= 4 ? "Ice in your veins" : "A hard-fought finish"}</h2>
          <strong>{score}</strong>
          <div>
            <p>
              <b>{accuracy}%</b>accuracy
            </p>
            <p>
              <b>{best}</b>best streak
            </p>
            <p>
              <b>{score >= 4 ? "A" : "B"}</b>grade
            </p>
          </div>
          {isSaving ? <p className="saving-state">Saving your run…</p> : null}
          <button onClick={restart}>Play again</button>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>
      )}
    </main>
  );
}

export default Game;
