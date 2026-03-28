import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

export default function CitizenRegister() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    aadhaar: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/register-citizen", form);

      auth.login(res.data.user, res.data.token);
      navigate("/citizen/home");

    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">

      <div className="absolute inset-0 bg-gradient-to-br from-[#EAF4FF] via-[#F6FBFF] to-[#E3FFF6]" />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 relative">

        <Link to="/citizen/login" className="text-blue-600 text-sm mb-4 inline-block">
          ← Back to Login
        </Link>

        <div className="text-center">
          <div className="text-5xl mb-3">📝</div>
          <h1 className="text-2xl font-bold text-gray-800">Citizen Registration</h1>
          <p className="text-gray-600 text-sm mt-1">
            Create your account to access police services
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">

          <input
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400"
            placeholder="Mobile Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400"
            placeholder="Aadhaar Number"
            value={form.aadhaar}
            onChange={(e) => setForm({ ...form, aadhaar: e.target.value })}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400 pr-10"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
            >
              {showPass ? "👁️‍🗨️" : "👁️"}
            </span>
          </div>

          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register / पंजीकरण करें"}
          </button>
        </form>

        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/citizen/login" className="text-blue-600">Login</Link>
        </div>

      </div>
    </div>
  );
}
