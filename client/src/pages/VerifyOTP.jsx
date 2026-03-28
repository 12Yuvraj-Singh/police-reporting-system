import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  
  const phoneNumber = location.state?.phoneNumber;
  const isResetFlow = location.state?.isResetFlow || false;

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/login");
    }
  }, [navigate, phoneNumber]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 6) {
      return setError("Please enter a valid 6-digit OTP");
    }

    setLoading(true);

    try {
      if (isResetFlow) {
        // Forward OTP to ResetPassword page to be consumed directly with new password
        // Using mock verification for reset flow just now, or could use Firebase if it was requested
        navigate("/reset-password", { state: { phoneNumber, otp } });
      } else {
        // Verify User OTP locally with Firebase first
        if (!window.confirmationResult) {
          throw new Error("OTP session expired. Please go back and request a new OTP.");
        }
        
        await window.confirmationResult.confirm(otp);
        
        // After successful Firebase verify, login on backend
        const response = await axios.post("/api/auth/otp-login", { phone: phoneNumber });
        
        // Login using existing hook (stores JWT)
        auth.login(response.data.user, response.data.token);
        
        setSuccessMsg("Logged in successfully!");
        
        // Clear global confirmation state
        window.confirmationResult = null;
        
        setTimeout(() => navigate("/citizen/home"), 1000);
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-verification-code") {
        setError("Invalid OTP code. Please try again.");
      } else if (err.code === "auth/code-expired") {
        setError("OTP expired. Please request a new one.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to verify OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Verify OTP</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Enter the code sent to {phoneNumber}</p>
        
        {error && <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mb-4 text-sm font-semibold text-center">{error}</div>}
        {successMsg && <div className="text-green-600 bg-green-50 border border-green-200 p-3 rounded-lg mb-4 text-sm font-semibold text-center">{successMsg}</div>}
        
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <input
            type="text"
            className="w-full p-4 border rounded-xl outline-none focus:border-blue-500 text-center text-xl tracking-[0.5em] font-bold"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
          />
          
          <button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg mt-4 transition" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
