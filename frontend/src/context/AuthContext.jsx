import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("acadexa_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("acadexa_token");
      if (token) {
        try {
          const response = await api.get("/auth/me");
          if (response.data?.user) {
            setUser(response.data.user);
            localStorage.setItem("acadexa_user", JSON.stringify(response.data.user));
          }
        } catch (err) {
          console.warn("Session expired or invalid, logging out:", err.message);
          localStorage.removeItem("acadexa_token");
          localStorage.removeItem("acadexa_user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    if (token) {
      localStorage.setItem("acadexa_token", token);
    }
    localStorage.setItem("acadexa_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("acadexa_token");
    localStorage.removeItem("acadexa_user");
  };

  const updateUser = (partialData) => {
    setUser((prev) => {
      const updated = { ...prev, ...partialData };
      localStorage.setItem("acadexa_user", JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    role: user?.role || "student",
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}