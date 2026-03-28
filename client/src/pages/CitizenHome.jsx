import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function CitizenHome() {

  return (
    <div className="min-h-screen bg-[#eef1f6] flex flex-col">

      {/* HERO BANNER */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 text-white py-14 px-6 rounded-b-[36px] shadow-xl overflow-hidden">

        {/* Soft gradient bubble */}
        <div className="absolute top-[-50px] right-[-40px] w-[220px] h-[220px] rounded-full bg-white/10 blur-3xl opacity-40" />

        {/* Soft bubble left */}
        <div className="absolute bottom-[-40px] left-[-30px] w-[180px] h-[180px] rounded-full bg-white/10 blur-2xl opacity-30" />

        <div className="relative z-10 flex mt-8 flex-col items-center text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
              alt="Police Icon"
              className="w-14 h-14 drop-shadow-lg"
            />
            <span className="text-5xl font-extrabold tracking-wide">IN</span>
            <span className="text-5xl">🛡️</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-lg">
            Serving with Honor, Protecting with Technology
          </h1>

          <p className="text-lg mt-3 opacity-95 font-light">
            Indian Police – Modernized for Better Public Service
          </p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-6xl w-full mx-auto px-6 mt-14">

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <GlassCard link="/file" icon="📝" title="File Complaint"
            desc="Lodge a new complaint or FIR"
          />

          <GlassCard link="/track" icon="📄" title="Track Complaint"
            desc="Monitor your complaint status"
          />

          <GlassCard link="/emergency" icon="🚨" title="Emergency Help"
            desc="Request immediate assistance"
            iconClass="text-red-500"
          />

          <GlassCard link="/status" icon="📊" title="View Status"
            desc="All updates & notifications"
          />
        </div>

        {/* Latest Updates Section */}
        <div className="glass mt-16 p-7 rounded-3xl shadow-lg bg-white/70 border border-white/40 backdrop-blur-xl">
          <h2 className="font-bold text-xl mb-5 flex items-center gap-2">
            <span className="text-pink-600 text-2xl">📢</span>
            Latest Updates from Local Police Station
          </h2>

          <div className="space-y-5">

            <UpdateCard
              color="blue"
              emoji="🚧"
              title="Traffic Advisory"
              desc="Road closure on MG Road from 2 PM to 6 PM today due to VIP movement."
              time="2 hours ago"
            />

            <UpdateCard
              color="green"
              emoji="✅"
              title="Case Update"
              desc="Your complaint CR1703123456 has been assigned to Inspector Sharma."
              time="1 day ago"
            />

            <UpdateCard
              color="yellow"
              emoji="⚠️"
              title="Safety Alert"
              desc="Increased patrolling in residential areas due to recent incidents."
              time="3 days ago"
            />
          </div>
        </div>

      </div>

      {/* GLOBAL STYLES FOR GLASS */}
      <style>{`
        .glass {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.35);
          transition: all 0.25s ease;
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.75);
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.12);
        }
      `}</style>

    </div>
  );
}

/* COMPONENTS */

const GlassCard = ({ link, icon, title, desc, iconClass }) => (
  <Link
    to={link}
    className="glass-card rounded-2xl p-7 shadow-md text-center cursor-pointer"
  >
    <div className={`text-6xl mb-4 drop-shadow-sm ${iconClass}`}>{icon}</div>
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-gray-600 text-sm mt-2">{desc}</p>
  </Link>
);

const UpdateCard = ({ color, emoji, title, desc, time }) => (
  <div className={`p-5 border-l-4 rounded-xl bg-${color}-50 border-${color}-400`}>
    <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-md">
      {emoji} {title}
    </h4>
    <p className="text-gray-600 text-sm mt-1">{desc}</p>
    <span className="text-xs text-gray-400 mt-1 block">{time}</span>
  </div>
);
