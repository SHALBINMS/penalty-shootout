import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Penalty Shootout</h1>

      <h2>{user ? "✅ Logged In" : "❌ Not Logged In"}</h2>

      {user && (
        <>
          <p>{user.token.substring(0, 30)}...</p>

          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default Home;
