import { useContext } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Result from "./pages/Result";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Stats from "./pages/Stats";
import AuthContext from "./context/AuthContext";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Register from "./pages/Register";

function App() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const showNavbar =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <>
      {/* Keep the sign-in view distraction-free while retaining the shared shell elsewhere. */}
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/game"
          element={user ? <Game /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/result"
          element={user ? <Result /> : <Navigate to="/login" replace />}
        />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/stats"
          element={user ? <Stats /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />
      </Routes>
    </>
  );
}

export default App;
