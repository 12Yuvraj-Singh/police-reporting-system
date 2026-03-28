import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

export default function CitizenLogin() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/login", {
        identifier: form.identifier,
        password: form.password,
        role: "citizen",
      });

      auth.login(res.data.user, res.data.token);
      navigate("/citizen/home");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#EAF4FF] via-[#F6FBFF] to-[#E3FFF6]" />

      <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl p-10 relative z-10">

        <Link to="/" className="text-blue-600 text-sm mb-4 inline-block">
          ← Back to Home
        </Link>

        <div className="text-center">
          <div className="text-5xl mb-3">👥</div>
          <h1 className="text-2xl font-bold text-gray-800">Citizen Login</h1>
          <p className="text-gray-600 text-sm mt-1">
            Connecting Citizens with Police Services – Secure & Transparent
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          
          {/* Identifier */}
          <div>
            <label className="text-gray-700 text-sm font-medium">
              Mobile Number / Aadhaar ID
            </label>
            <input
              className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              placeholder="Enter mobile number or Aadhaar ID"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 text-sm font-medium">
              Password / OTP
            </label>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="w-full mt-1 p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password or OTP"
              />

              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-4 cursor-pointer text-gray-500"
              >
                {showPass ? "👁️‍🗨️" : "👁️"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Remember me
            </label>
            <button type="button" className="text-blue-600 text-sm">Send OTP</button>
          </div>

          <button
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-semibold mt-2"
          >
            {loading ? "Logging in..." : "Login / लॉगिन करें"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="text-gray-600">New user? </span>
          <Link to="/citizen/register" className="text-blue-600 font-medium">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
