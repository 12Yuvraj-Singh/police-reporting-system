import React, { createContext, useState, useEffect } from "react";
import { setAuthToken } from "../api/axios";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("pp:user");
    const t = localStorage.getItem("pp:token");
    if (u && t) {
      setUser(JSON.parse(u));
      setToken(t);
      setAuthToken(t);
    }
  }, []);

  const login = (u, t) => {
    setUser(u);
    setToken(t);
    localStorage.setItem("pp:user", JSON.stringify(u));
    localStorage.setItem("pp:token", t);
    setAuthToken(t);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("pp:user");
    localStorage.removeItem("pp:token");
    setAuthToken(null);
    // optional: reload to reset sockets / state
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
