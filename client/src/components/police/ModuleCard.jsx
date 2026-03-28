import React from "react";

export default function ModuleCard({ title, subtitle, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-6 rounded-xl bg-[#0f2438] hover:bg-[#122c42] transition-shadow shadow-md border border-[#122434]"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-semibold text-white text-lg">{title}</div>
      {subtitle && <div className="text-sm text-gray-300 mt-2">{subtitle}</div>}
    </div>
  );
}
