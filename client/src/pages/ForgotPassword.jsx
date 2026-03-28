import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || phoneNumber.length < 10) {
      return setError("Please enter a valid phone number");
    }

    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
    setLoading(true);

    try {
      // Send OTP via Backend instead of Firebase
      const res = await axios.post("/api/auth/send-otp", { phone: formattedPhone });
      console.log(res.data.message);
      
      navigate("/verify", { state: { phoneNumber: formattedPhone, isResetFlow: true } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">We'll send you an OTP to reset your password.</p>
        
        {error && <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mb-4 text-sm font-semibold text-center">{error}</div>}
        
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm font-semibold">Registered Phone Number</label>
            <div className="flex mt-1 relative">
              <span className="p-3 py-4 border border-r-0 rounded-l-xl bg-gray-50 text-gray-500 font-semibold flex items-center">+91</span>
              <input type="tel" className="w-full p-4 border border-l-0 rounded-r-xl outline-none focus:border-blue-500" placeholder="10-digit number" 
                     value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} disabled={loading} style={{ paddingRight: '120px' }} />
              
              <button disabled={loading} type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 font-bold text-sm transition">
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </div>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Remembered it? <Link to="/login" className="text-blue-600 font-bold hover:underline">Go to Login</Link>
        </p>
      </div>
    </div>
  );
}
