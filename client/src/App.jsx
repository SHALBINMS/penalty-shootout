import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Game from "./pages/Game";
import Result from "./pages/Result";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/game" element={<Game />} />
      <Route path="/result" element={<Result />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
