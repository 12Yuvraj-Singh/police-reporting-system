import React, { useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { 
        email: identifier, 
        password 
      });
      auth.login(res.data.user, res.data.token);
      nav("/police"); // Admin redirects to police dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Admin Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-2 text-center text-blue-400">Admin Portal</h2>
        <p className="text-center text-gray-400 mb-6 text-sm">Sign in to the Police Command Center</p>
        
        <form onSubmit={submit} className="space-y-4">
          <input 
            value={identifier} 
            onChange={(e) => setIdentifier(e.target.value)} 
            placeholder="Official Email or Batch No" 
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl outline-none focus:border-blue-500 transition" 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-xl outline-none focus:border-blue-500 transition" 
          />
          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 font-bold text-white py-4 rounded-xl mt-4 transition"
          >
            {loading ? "Authenticating..." : "Admin Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
