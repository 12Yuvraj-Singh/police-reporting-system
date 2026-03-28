import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

export default function PoliceLogin() {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/login", {
        identifier: form.identifier,
        password: form.password,
        role: "police",
      });

      auth.login(res.data.user, res.data.token);
      navigate("/police/home");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0B1739] text-white">
      <div className="max-w-md w-full bg-[#101B4D] p-10 rounded-3xl shadow-xl">

        <Link to="/" className="text-blue-300 text-sm">← Back to Home</Link>

        <div className="text-center mt-3">
          <div className="text-5xl mb-3">👮‍♂️</div>
          <h1 className="text-2xl font-bold">Police Login</h1>
          <p className="text-gray-300 text-sm">Empowering Police with Smart Digital Tools</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">

          {/* Identifier */}
          <div>
            <label className="text-gray-300 text-sm">Police ID / Badge Number</label>
            <input
              className="w-full mt-1 p-3 rounded-xl bg-[#18245A] text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter Police ID or Badge Number"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            />
          </div>

          {/* Password field */}
          <div>
            <label className="text-gray-300 text-sm">Password</label>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="w-full mt-1 p-3 rounded-xl bg-[#18245A] text-white border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none pr-10"
                placeholder="Enter secure password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <span
                className="absolute right-3 top-4 cursor-pointer text-gray-300"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "👁️‍🗨️" : "👁️"}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> Keep me logged in
            </label>
            <button className="text-blue-300">Forgot Password?</button>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition mt-2"
          >
            {loading ? "Logging in..." : "Secure Login / सुरक्षित लॉगिन"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <span className="text-gray-300">New officer? </span>
          <Link to="/police/register" className="text-blue-300 font-medium">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}
