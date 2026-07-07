import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login
  const login = (token) => {
    localStorage.setItem("token", token);

    setUser({
      token,
    });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Keep user logged in after refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setUser({
        token,
      });
    }
  }, []);

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
