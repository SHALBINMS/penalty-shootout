import football from "../assets/game/football.png";
import goalkeeper from "../assets/game/goalkeeper.png";
import striker from "../assets/game/striker.png";

export function Ball({ phase, outcome, direction, x, y, flightMs, power }) {
  const keeperOffset = direction === "left" ? -115 : direction === "right" ? 115 : 0;

  return (
    <div
      className={`ball-scene ${phase} ${outcome === "GOAL" ? "goal-shot" : "keeper-catch"}`}
      style={{
        "--x": `${x * 130}px`,
        "--y": `${-(260 - y * 90)}px`,
        "--keeper-x": `${keeperOffset}px`,
        animationDuration: phase === "flight" ? `${flightMs}ms` : undefined,
        animationTimingFunction:
          power > 78
            ? "cubic-bezier(.12,.82,.22,1)"
            : power < 38
              ? "cubic-bezier(.32,.58,.48,1)"
              : "cubic-bezier(.2,.72,.3,1)",
      }}
    >
      <i className="ball-shadow" />
      <img className="match-ball" src={football} alt="" />
      <span
        className="ball-trail"
        style={{
          animationDuration:
            phase === "flight" ? `${Math.round(flightMs * 0.9)}ms` : undefined,
        }}
      />
    </div>
  );
}

export function Goalkeeper({ phase, outcome, direction, row }) {
  return (
    <div className={`keeper ${phase} ${outcome === "GOAL" ? "beaten" : "save"} ${direction} ${row || "mid"}`}>
      <img className="keeper-avatar" src={goalkeeper} alt="Goalkeeper" />
    </div>
  );
}

export function Player({ phase }) {
  return (
    <div className={`striker ${phase}`}>
      <img className="striker-avatar" src={striker} alt="Striker" />
    </div>
  );
}
