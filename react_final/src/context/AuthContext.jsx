// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // {id, username, role, ...}
  const [loading, setLoading] = useState(true);

  // Fetch /me if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("me/");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch /me", err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (username, password) => {
    const res = await api.post("login/", { username, password });
    const { token: jwtToken } = res.data;

    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    const meRes = await api.get("me/");
    setUser(meRes.data);

    return meRes.data; // contains role, username etc.
  };

  const signup = async (username, password, role) => {
    await api.post("signup/", { username, password, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
