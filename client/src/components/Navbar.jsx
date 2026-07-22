import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

//////////////////////////////////////////////////
// Navigation
//////////////////////////////////////////////////

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const closeNavigation = () => setOpen(false);

  // Clear the token here so logging out works even when the context provider is
  // not the source of the active session.
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo" onClick={closeNavigation}>
        <span className="brand-mark">P</span>
        Penalty Cup 2026
      </NavLink>

      <button
        className="nav-toggle"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        <i />
        <i />
        <i />
      </button>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <NavLink to="/" end onClick={closeNavigation}>Dashboard</NavLink>
        <NavLink to="/game" onClick={closeNavigation}>Play</NavLink>
        <NavLink to="/leaderboard" onClick={closeNavigation}>Ranking</NavLink>
        <NavLink to="/stats" onClick={closeNavigation}>Statistics</NavLink>
        <button onClick={logout}>Log out</button>
      </div>
    </nav>
  );
}

export default Navbar;
