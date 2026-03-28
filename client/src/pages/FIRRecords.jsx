import React, { useEffect, useState, useContext } from "react";
import ComplaintCard from "../components/police/ComplaintCard";
import UpdateStatusModal from "../components/police/UpdateStatusModal";
import FileTrackerModal from "../components/police/FileTrackerModal";
import axios from "../api/axios";
import { POLICE } from "../api/endpoints";
import { SocketContext } from "../context/SocketContext";

export default function FIRRecords() {
  const [firs, setFirs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(POLICE.LIST);
        const arr = res.data.complaints || [];
        setFirs(arr.filter(c => c.category === "fir" || c.isFIR));
      } catch (err) {
        console.warn(err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("complaint:updated", (c) => {
      if (c.category === "fir" || c.isFIR) {
        setFirs(s => s.map(x => x._id === (c._id||c.id) ? c : x));
      }
    });
    return () => {
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
    setFirs(s => s.map(x => x._id === (updated._id||updated.id) ? updated : x));
  };

  return (
    <div className="p-6 rounded-xl bg-[#071122] border border-[#122434]">
      <h3 className="font-semibold mb-4">FIR Records</h3>
      <div className="space-y-3">
        {firs.length === 0 && <div className="text-gray-400">No FIR records found.</div>}
        {firs.map(f => (
          <ComplaintCard key={f._id || f.id} complaint={f} onOpen={openUpdate} onTrack={openTracker} />
        ))}
      </div>

      <UpdateStatusModal open={modalOpen} onClose={()=>setModalOpen(false)} complaint={selected} onUpdated={onUpdated} />
      <FileTrackerModal open={trackerOpen} onClose={()=>setTrackerOpen(false)} complaint={selected} />
    </div>
  );
}
