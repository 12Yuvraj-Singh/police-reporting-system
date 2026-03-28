import React, { useEffect, useState, useContext } from "react";
import axios from "../../api/axios";
import { SocketContext } from "../../context/SocketContext";

export default function Notifications() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/notifications/my");
        setNotes(res.data.notifications || []);
      } catch (err) {
        console.warn(err);
      }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("notification", (n) => {
      setNotes(s => [n, ...s]);
    });
    return () => socket?.off("notification");
  }, [socket]);

  const markRead = async (id) => {
    try {
      await axios.post(`/api/notifications/${id}/read`);
      setNotes(s => s.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) { console.warn(err); }
  };

  if (loading) return <div className="pt-32 text-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-[#eef1f6] pt-28 px-6 pb-12">
      <div className="max-w-4xl mx-auto glass p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>

        {notes.length === 0 ? (
          <div className="text-gray-500">No notifications.</div>
        ) : (
          <div className="space-y-3">
            {notes.map(n => (
              <div key={n._id} className={`p-4 rounded-lg border ${n.read ? "bg-white/60" : "bg-blue-50 border-blue-200"}`}>
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{n.title}</div>
                    <div className="text-sm text-gray-600">{n.body}</div>
                  </div>
                  <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div className="mt-2 flex gap-2">
                  {!n.read && <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm" onClick={()=>markRead(n._id)}>Mark as read</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
