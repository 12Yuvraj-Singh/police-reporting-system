import React, { useEffect, useState, useContext } from "react";
import ComplaintCard from "../components/police/ComplaintCard";
import UpdateStatusModal from "../components/police/UpdateStatusModal";
import FileTrackerModal from "../components/police/FileTrackerModal";
import axios from "../api/axios";
import { POLICE } from "../api/endpoints";
import { SocketContext } from "../context/SocketContext";

export default function CaseManagement() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(POLICE.LIST);
        setComplaints(res.data.complaints || []);
      } catch (err) {
        console.warn(err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("complaint:created", (c) => setComplaints(s => [c, ...s]));
    socket.on("complaint:updated", (c) => setComplaints(s => s.map(x => x._id === (c._id||c.id) ? c : x)));
    return () => {
      socket?.off("complaint:created");
      socket?.off("complaint:updated");
    };
  }, [socket]);

  const openUpdate = (complaint) => {
    setSelected(complaint);
    setModalOpen(true);
  };

  const openTracker = (complaint) => {
    setSelected(complaint);
    setTrackerOpen(true);
  };

  const onUpdated = (updated) => {
    setComplaints(s => s.map(x => x._id === (updated._id||updated.id) ? updated : x));
  };

  const filtered = complaints.filter(c => {
    if (filter === "all") return true;
    if (filter === "new") return c.status === "Pending";
    if (filter === "active") return c.status === "In Progress";
    if (filter === "resolved") return c.status === "Resolved";
    return true;
  });

  return (
    <div className="p-6 rounded-xl bg-[#071122] border border-[#122434]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Case Management</h3>
        <div className="flex gap-2">
          <select className="p-2 bg-[#0b2736] rounded text-white" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="new">New (Pending)</option>
            <option value="active">Active (In Prog)</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-gray-400">No cases</div>}
        {filtered.map(c => (
          <ComplaintCard key={c._id || c.id} complaint={c} onOpen={openUpdate} onTrack={openTracker} />
        ))}
      </div>

      <UpdateStatusModal open={modalOpen} onClose={()=>setModalOpen(false)} complaint={selected} onUpdated={onUpdated} />
      <FileTrackerModal open={trackerOpen} onClose={()=>setTrackerOpen(false)} complaint={selected} />
    </div>
  );
}
