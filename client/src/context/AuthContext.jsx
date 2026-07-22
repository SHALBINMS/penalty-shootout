import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Read storage once during initialization so protected UI does not render a
  // logged-out state before the persisted session is restored.
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");

    return token ? { token } : null;
  });

  // Store the token in both state and storage so the session survives a full page refresh.
  const login = (token) => {
    localStorage.setItem("token", token);

    setUser({
      token,
    });
  };

  // Remove both copies to prevent stale credentials from recreating a session.
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ps_best_streak");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
