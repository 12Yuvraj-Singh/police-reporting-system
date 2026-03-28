import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber;
  const otp = location.state?.otp;

  useEffect(() => {
    if (!phoneNumber || !otp) {
      navigate("/login");
    }
  }, [navigate, phoneNumber]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/auth/reset-password", { phone: phoneNumber, otp, newPassword });
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create New Password</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Set a new strong password for your account.</p>
        
        {error && <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mb-4 text-sm font-semibold text-center">{error}</div>}
        
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            className="w-full p-4 border rounded-xl outline-none focus:border-blue-500"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          
          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg mt-4 transition" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
