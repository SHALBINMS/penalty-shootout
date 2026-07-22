import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Result from "./pages/Result";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Stats from "./pages/Stats";
import { Route, Routes, useLocation } from "react-router-dom";
import Register from "./pages/Register";

function App() {
  const location = useLocation();

  return (
    <>
      {/* Keep the sign-in view distraction-free while retaining the shared shell elsewhere. */}
      {location.pathname !== "/login" && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="/result" element={<Result />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
