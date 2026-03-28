import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing recaptcha window variables on mount
    window.recaptchaVerifier = null;
    window.confirmationResult = null;
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          window.recaptchaVerifier?.clear();
          window.recaptchaVerifier = null;
        }
      });
    }
    return window.recaptchaVerifier;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || phoneNumber.length < 10) {
      return setError("Please enter a valid phone number");
    }

    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
    setLoading(true);

    try {
      const appVerifier = setupRecaptcha();
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      // Store confirmation result in window object to be accessed in VerifyOTP page
      window.confirmationResult = confirmationResult;
      
      navigate("/verify", { state: { phoneNumber: formattedPhone } });
    } catch (err) {
      console.error("Firebase OTP Error:", err);
      // Clean up recaptcha state so they can try again
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Citizen Login</h2>
        {error && <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mb-4 text-sm font-semibold text-center">{error}</div>}
        
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm font-semibold">Phone Number</label>
            <div className="flex mt-1 relative">
              <span className="p-3 py-4 border border-r-0 rounded-l-xl bg-gray-50 text-gray-500 font-semibold flex items-center">+91</span>
              <input type="tel" className="w-full p-4 border border-l-0 rounded-r-xl outline-none focus:border-blue-500" placeholder="10-digit number" 
                     value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} disabled={loading} style={{ paddingRight: '120px' }} />
              
              <button disabled={loading} type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 font-bold text-sm transition">
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
            <div id="recaptcha-container" className="mt-2"></div>
          </div>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm">
          <Link to="/forgot-password" className="text-blue-600 font-semibold hover:underline">Forgot Password?</Link>
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create Account</Link>
        </div>
        
        <div className="mt-8 text-center border-t pt-4">
          <Link to="/admin-login" className="text-gray-500 hover:text-gray-800 font-medium text-sm transition">Police / Admin Login Portal</Link>
        </div>
      </div>
    </div>
  );
}
