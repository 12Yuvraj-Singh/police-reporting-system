import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password) return setError("All fields required");
    
    // Convert to +91 if needed
    const formattedPhone = form.phone.startsWith("+") ? form.phone : `+91${form.phone}`;

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", {
        name: form.name,
        phone: formattedPhone,
        password: form.password
      });
      alert(res.data.message);
      // Requirement: After registration -> redirect to login page (not dashboard)
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
        {error && <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mb-4 text-sm font-semibold">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm font-semibold">Full Name</label>
            <input type="text" className="w-full mt-1 p-3 border rounded-xl outline-none focus:border-blue-500" placeholder="John Doe" 
                   value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="text-gray-600 text-sm font-semibold">Phone Number</label>
            <div className="flex mt-1">
              <span className="p-3 border border-r-0 rounded-l-xl bg-gray-50 text-gray-500 font-semibold">+91</span>
              <input type="tel" className="w-full p-3 border border-l-0 rounded-r-xl outline-none focus:border-blue-500" placeholder="10-digit number" 
                     value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-gray-600 text-sm font-semibold">Password</label>
            <input type="password" className="w-full mt-1 p-3 border rounded-xl outline-none focus:border-blue-500" placeholder="••••••••" 
                   value={form.password} onChange={e=>setForm({...form, password: e.target.value})} />
          </div>

          <button disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg mt-4 transition">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
