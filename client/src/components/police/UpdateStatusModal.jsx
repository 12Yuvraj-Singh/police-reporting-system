import React, { useState } from "react";
import axios from "../../api/axios";
import { POLICE } from "../../api/endpoints";

export default function UpdateStatusModal({ open, onClose, complaint, onUpdated }) {
  const [status, setStatus] = useState(complaint?.status || "");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setStatus(complaint?.status || "");
    setNote("");
  }, [complaint]);

  if (!open) return null;

  const submit = async () => {
    if (!complaint) return;
    setLoading(true);
    try {
      const res = await axios.post(POLICE.UPDATE(complaint._id), { status, note });
      onUpdated(res.data.complaint);
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl p-6 bg-[#07121a] border border-[#122434] rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-3">Update Complaint</h3>

        <div className="space-y-3">
          <label className="text-sm text-gray-300">Status</label>
          <select className="w-full p-3 rounded bg-[#0b2736] text-white border border-[#12303f]" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="">Select</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <label className="text-sm text-gray-300">Note (optional)</label>
          <textarea className="w-full p-3 rounded bg-[#0b2736] text-white border border-[#12303f]" rows={4} value={note} onChange={(e)=>setNote(e.target.value)} />

          <div className="flex justify-end gap-3 mt-4">
            <button className="px-4 py-2 rounded bg-white/10 text-white" onClick={onClose}>Cancel</button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={submit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
