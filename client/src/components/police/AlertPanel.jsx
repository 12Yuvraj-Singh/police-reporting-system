import React from "react";

export default function AlertPanel({ alerts = [] }) {
  return (
    <div className="p-4 rounded-lg bg-[#081926] border border-[#122434]">
      <div className="flex items-center gap-2 text-yellow-300 font-semibold mb-3">🔔 Priority Alerts & Pending Tasks</div>
      <div className="space-y-2">
        {alerts.length === 0 && <div className="text-gray-400">No alerts</div>}
        {alerts.map((a, idx) => (
          <div key={idx} className="p-3 rounded bg-[#071827] border border-[#0f2b3a]">
            <div className="font-medium text-white">{a.title}</div>
            <div className="text-sm text-gray-300">{a.body}</div>
            <div className="text-xs text-gray-500 mt-1">{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
