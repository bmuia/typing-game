import React, { useEffect, useState, useContext, createContext } from "react";

const AuthContext = createContext();

// Custom hook for using auth
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        // Ideally, you'd verify token with backend here
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Invalid token ❌", err);
        localStorage.removeItem("access_token");
      }
    }

    setLoading(false);
  }, []);

  // Login function: save token and update state
  const login = (access, refresh) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setIsAuthenticated(true);
  };

  // Logout function: remove tokens and update state
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
