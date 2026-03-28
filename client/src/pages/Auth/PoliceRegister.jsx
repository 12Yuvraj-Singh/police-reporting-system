import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

export default function PoliceRegister() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [form, setForm] = useState({
    name: "",
    batchNo: "",
    stationId: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/register-police", form);

      auth.login(res.data.user, res.data.token);
      navigate("/police/home");

    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0B1739] text-white">

      <div className="max-w-md w-full bg-[#101B4D] p-10 rounded-3xl shadow-xl">

        <Link to="/police/login" className="text-blue-300 text-sm">
          ← Back to Login
        </Link>

        <div className="text-center mt-3">
          <div className="text-5xl mb-3">📋</div>
          <h1 className="text-2xl font-bold">Police Registration</h1>
          <p className="text-gray-300 text-sm">Create your official police account</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">

          <input
            className="w-full p-3 rounded-xl bg-[#18245A] text-white border border-gray-600 focus:ring-2 focus:ring-blue-400"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="w-full p-3 rounded-xl bg-[#18245A] text-white border border-gray-600 focus:ring-2 focus:ring-blue-400"
            placeholder="Police ID / Batch Number"
            value={form.batchNo}
            onChange={(e) => setForm({ ...form, batchNo: e.target.value })}
          />

          <input
            className="w-full p-3 rounded-xl bg-[#18245A] text-white border border-gray-600 focus:ring-2 focus:ring-blue-400"
            placeholder="Station ID"
            value={form.stationId}
            onChange={(e) => setForm({ ...form, stationId: e.target.value })}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="w-full p-3 rounded-xl bg-[#18245A] text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 pr-10"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-300"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "👁️‍🗨️" : "👁️"}
            </span>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register / पंजीकरण करें"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="text-gray-400">Already have an account? </span>
          <Link to="/police/login" className="text-blue-300">Login</Link>
        </div>

      </div>
    </div>
  );
}
