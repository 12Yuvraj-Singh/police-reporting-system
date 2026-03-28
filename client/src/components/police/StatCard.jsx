import React from "react";

export default function StatCard({ label, value, accent }) {
  return (
    <div className="p-4 rounded-lg bg-[#0f2438] border border-[#122434] shadow-sm">
      <div className={`text-2xl font-bold ${accent ? "text-neon" : "text-white"}`}>{value}</div>
      <div className="text-xs text-gray-300 mt-1">{label}</div>
    </div>
  );
}
