import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between relative overflow-hidden">

      {/* TRICOLOR BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f58442] via-[#ffffff] to-[#2eff38] -z-20" />

      {/* SOFT BLUR SPOTS */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-orange-200 opacity-40 blur-3xl -z-10" />
      <div className="absolute bottom-[-120px] right-[-150px] w-[400px] h-[400px] rounded-full bg-green-200 opacity-40 blur-3xl -z-10" />

      {/* HERO ARC BEHIND CARDS */}
      <div className="absolute top-[28%] w-[700px] h-[350px] border border-gray-300/40 rounded-full 
                      -z-10 blur-sm left-1/2 -translate-x-1/2" />

      {/* TOP SECTION */}
      <div className="pt-16 text-center animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-800">
          <span className="font-bold text-black">IN </span>
          Smart Policing Portal
        </h1>

        <p className="text-gray-700 text-lg mt-1 font-medium">भारत – India</p>

        <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">
          Connecting Citizens with Police Services – Secure, Transparent & Digital
        </p>
      </div>

      {/* LOGIN BOXES */}
      <div className="flex flex-col md:flex-row items-center gap-10 mt-12 mb-10 animate-slideUp">

        {/* CITIZEN LOGIN */}
        <div className="glass-card w-[300px] p-8 rounded-2xl shadow-xl text-center border border-white/40">
          <div className="text-5xl mb-3">👥</div>
          <h3 className="text-xl font-bold text-gray-800">Citizen Login</h3>

          <p className="text-gray-600 text-sm mt-2">
            File complaints, track FIR status,<br />and access police services
          </p>

          <div className="flex justify-center gap-3 text-2xl mt-4">
            <span>📝</span>
            <span>📄</span>
            <span>📊</span>
          </div>

          <Link
            to="/login"
            className="block mt-5 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold text-sm shadow-md transition"
          >
            नागरिक लॉगिन / Citizen Login
          </Link>
        </div>

        {/* POLICE LOGIN */}
        <div className="glass-card w-[300px] p-8 rounded-2xl shadow-xl text-center border border-white/40">
          <div className="text-5xl mb-3">👮‍♂️</div>
          <h3 className="text-xl font-bold text-gray-800">Police Login</h3>

          <p className="text-gray-600 text-sm mt-2">
            Case management, FIR records,<br />and administrative tools
          </p>

          <div className="flex justify-center gap-3 text-2xl mt-4">
            <span>⚖️</span>
            <span>📁</span>
            <span>📊</span>
          </div>

          <Link
            to="/admin-login"
            className="block mt-5 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold text-sm shadow-md transition"
          >
            पुलिस लॉगिन / Police Login
          </Link>
        </div>

      </div>

      {/* FOOTER */}
      <div className="py-4 text-center text-gray-600 text-xs animate-fadeInSlow">
        <p className="font-medium">सत्यमेव जयते • Truth Alone Triumphs</p>
        <p className="mt-1">Government of India • Ministry of Home Affairs</p>
      </div>

      {/* STYLES */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.60);
          backdrop-filter: blur(18px);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes fadeInSlow {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 1.5s ease-out forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.9s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
