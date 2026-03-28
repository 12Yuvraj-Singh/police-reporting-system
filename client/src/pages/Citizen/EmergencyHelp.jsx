import React, { useState } from "react";
import axios from "../../api/axios";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function EmergencyHelp() {
  const [status, setStatus] = useState("idle");
  const [complaintId, setComplaintId] = useState(null);

  const sendEmergency = async () => {
    setStatus("sending");

    try {
      const res = await axios.post("/api/emergency", {
        lat: 0,
        lng: 0,
        message: "Emergency assistance needed",
      });

      setComplaintId(res.data.complaint._id);
      setStatus("sent");

      socket.on("emergency:alert", () => {
        setStatus("responding");
      });

    } catch (e) {
      setStatus("idle");
      alert("Failed to send emergency request");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100">

      {/* TRICOLOR HERO */}
      <div className="h-48 bg-gradient-to-r from-[#ffddbf] via-white to-[#c9f5d6] rounded-b-3xl shadow-sm px-6 flex items-end pb-6">
        <h1 className="text-3xl font-bold text-gray-800">Emergency Help</h1>
      </div>

      {/* GLASS CARD */}
      <div className="-mt-14 max-w-lg mx-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl p-10 rounded-3xl text-center">

        <p className="text-gray-700 mb-6">
          Press the button below to immediately alert your nearest Police Station.
        </p>

        <button
          onClick={sendEmergency}
          className="w-full py-5 text-xl font-bold rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-xl transition transform hover:-translate-y-1"
        >
          🚨 SEND EMERGENCY ALERT
        </button>

        {/* STATUS BOX */}
        {status !== "idle" && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-semibold">
              {status === "sending" && "Connecting to Police…"}
              {status === "sent" && "Alert Sent! Nearest Police Station Notified"}
              {status === "responding" && "Police Responding – Stay Safe!"}
            </p>

            {complaintId && (
              <p className="text-xs text-gray-500 mt-2">ID: {complaintId}</p>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
