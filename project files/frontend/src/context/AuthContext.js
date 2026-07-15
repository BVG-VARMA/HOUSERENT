import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("nf_token") || null);
  const [loading, setLoading] = useState(true);

  // Hydrate user from a stored token on first load (survives page refresh)
  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem("nf_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        setToken(storedToken);
      } catch (err) {
        localStorage.removeItem("nf_token");
        localStorage.removeItem("nf_user");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, user: loggedInUser } = res.data;
    localStorage.setItem("nf_token", newToken);
    localStorage.setItem("nf_user", JSON.stringify(loggedInUser));
    setToken(newToken);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem("nf_token", newToken);
    localStorage.setItem("nf_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("nf_token");
    localStorage.removeItem("nf_user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
