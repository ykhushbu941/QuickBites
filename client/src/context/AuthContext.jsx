import { createContext, useState, useEffect } from "react";
import axios from "axios";
import API from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios default
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/user/me");
      setUser(res.data);
      // 🔥 Always sync the role from the backend as the source of truth
      if (res.data.role) {
        setRole(res.data.role);
        localStorage.setItem("role", res.data.role);
      }
    } catch (error) {
      console.error("Token invalid or expired", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, newRole, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const updateSavedFoods = (savedFoods) => {
    if (user) {
      setUser({ ...user, savedFoods });
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-[var(--bg-primary)]">
        <div className="w-12 h-12 border-4 border-[var(--brand-orange)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[var(--text-secondary)] font-bold animate-pulse">Initializing ReelBite...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, role, user, loading, login, logout, updateSavedFoods, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};