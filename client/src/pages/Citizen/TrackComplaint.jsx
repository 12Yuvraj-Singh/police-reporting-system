import React, { useEffect, useState, useContext } from "react";
import axios from "../../api/axios";
import io from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";
import { COMPLAINT } from "../../api/endpoints";

const socket = io("http://localhost:4000", { autoConnect: true });

export default function TrackComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const progress = {
    Pending: 25,
    "In Progress": 60,
    Resolved: 100,
  };

  useEffect(() => {
    loadComplaints();

    socket.on("complaint:updated", (data) => {
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === data.complaintId
            ? { ...c, status: data.status, lastNote: data.note }
            : c
        )
      );
    });

    return () => socket.off("complaint:updated");
  }, []);

  const loadComplaints = async () => {
    if (!user || (!user._id && !user.id)) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.get(COMPLAINT.USER(user._id || user.id));
      setComplaints(res.data.complaints);
    } catch (e) {
      console.log("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user._id || user.id)) {
      loadComplaints();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[#f5f8fa]">

      {/* TRICOLOR HERO */}
      <div className="h-48 bg-gradient-to-r from-[#ffddbf] via-white to-[#c9f5d6] rounded-b-3xl shadow-sm px-6 flex items-end pb-6">
        <h1 className="text-3xl font-bold text-gray-800">Track Complaint</h1>
      </div>

      {/* CENTER GLASS CARD */}
      <div className=" max-w-5xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl p-8 rounded-3xl">

        <h2 className="text-xl font-semibold text-gray-700">
          Your Active Complaints
        </h2>

        {loading && <p className="text-gray-500 mt-6">Loading...</p>}

        {!loading && complaints.length === 0 && (
          <p className="text-gray-500 mt-8 text-center">
            You haven’t filed any complaints yet.
          </p>
        )}

        <div className="mt-6 space-y-6">
          {complaints.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{c.title}</h3>
                <span
                  className={`px-3 py-1 text-xs rounded-full capitalize ${
                    c.status === "Pending"
                      ? "bg-blue-100 text-blue-700"
                      : c.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : c.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <p className="text-gray-600 mt-1">{c.description}</p>

              {/* PROGRESS BAR */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 h-3 rounded-xl">
                  <div
                    className="h-3 bg-green-500 rounded-xl transition-all"
                    style={{ width: `${progress[c.status] || 0}%` }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  Progress: {progress[c.status] || 0}%
                </p>
              </div>

              {/* LIVE MAP TRACKING */}
              {c.location && c.location.latitude && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Location Tracked</p>
                  <iframe 
                    width="100%" 
                    height="180" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0" 
                    src={`https://maps.google.com/maps?q=${c.location.latitude},${c.location.longitude}&z=15&output=embed`}
                    className="rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
              )}

              {/* POLICE UPDATE */}
              {c.lastNote && (
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Police Update:</strong> {c.lastNote}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-4">
                Filed on {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
