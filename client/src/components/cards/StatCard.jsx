import React from "react";

export default function StatCard({ label, value, accent }) {
  return (
    <div className="p-4 rounded-xl glass neon-border smooth flex flex-col items-start">
      <div className={`text-3xl font-bold ${accent ? 'text-neon' : 'text-white'}`}>{value}</div>
      <div className="text-sm text-gray-300 mt-1">{label}</div>
    </div>
  );
}
