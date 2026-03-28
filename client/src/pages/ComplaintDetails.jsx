import React from "react";

export default function ComplaintDetails({ complaint }) {
  if (!complaint) return <div className="text-gray-400">No complaint selected</div>;
  return (
    <div className="p-4 rounded bg-[#0b2736] border border-[#12303f]">
      <h4 className="font-semibold text-white">{complaint.title}</h4>
      <div className="text-sm text-gray-300 mt-2">{complaint.description}</div>
      <div className="text-xs text-gray-400 mt-3">Status: {complaint.status}</div>
    </div>
  );
}
