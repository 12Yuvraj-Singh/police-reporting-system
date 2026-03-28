import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function ViewStatus() {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    loadData();

    socket.on("complaint:updated", () => loadData());

    return () => socket.off("complaint:updated");
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get("/api/notifications");
      setNotifs(res.data.notifications || []);
    } catch (e) {
      console.log("Error loading notifications");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8fa]">

      {/* TRICOLOR HERO */}
      <div className="h-48 bg-gradient-to-r from-[#ffddbf] via-white to-[#c9f5d6] rounded-b-3xl shadow-sm px-6 flex items-end pb-6">
        <h1 className="text-3xl font-bold text-gray-800">Latest Updates</h1>
      </div>

      {/* GLASS CARD */}
      <div className="-mt-14 max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl p-8 rounded-3xl">

        {!notifs.length && (
          <p className="text-gray-500 text-center mt-8">No updates yet.</p>
        )}

        <div className="space-y-5">
          {notifs.map((n) => (
            <div
              key={n._id}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{n.title}</h3>
              <p className="text-gray-600 mt-1">{n.body}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
