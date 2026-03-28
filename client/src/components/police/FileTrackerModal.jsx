import React from "react";
import { FiMapPin, FiClock, FiUser, FiPhone, FiInfo } from "react-icons/fi";

export default function FileTrackerModal({ open, onClose, complaint }) {
  if (!open || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col p-6 bg-[#07121a] border border-[#122434] rounded-xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#122434]">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FiInfo className="text-blue-400" />
            File Information Tracker
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition text-xl px-2">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
          {/* Case Details */}
          <section className="bg-[#0b1628] rounded-xl p-4 border border-[#1d2d42]">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-blue-100">{complaint.title}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                complaint.status === "filed" ? "bg-blue-600/30 text-blue-300" :
                complaint.status === "in_progress" ? "bg-yellow-600/30 text-yellow-300" :
                "bg-green-600/30 text-green-300"
              }`}>
                {complaint.status.replace("_", " ")}
              </span>
            </div>
            
            <p className="text-gray-300 text-sm mb-4 bg-[#07121a] p-3 rounded-lg border border-[#122434]">
              {complaint.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center flex-wrap gap-2">
                  <FiMapPin className="text-blue-300" /> 
                  <span>{complaint.location || "N/A"}</span>
                  {complaint.location && complaint.location.latitude && (
                    <a
                      href={`https://maps.google.com/?q=${complaint.location.latitude},${complaint.location.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow-md transition"
                    >
                      Open Map
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2"><FiClock className="text-green-300" /> {new Date(complaint.createdAt).toLocaleString()}</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold inline-flex">C</div> {complaint.category || "General"}</div>
              </div>
              
              <div className="space-y-2 text-gray-400 bg-[#07121a] p-3 rounded border border-[#122434]">
                <div className="font-semibold text-gray-200 mb-1">Complainant Details</div>
                <div className="flex items-center gap-2">
                  <FiUser className="text-yellow-400" /> 
                  <span className="text-gray-300">{complaint.citizen?.name || "Unknown Citizen"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-yellow-400" /> 
                  <span className="text-gray-300">{complaint.citizen?.phone || "N/A"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Tracking Timeline */}
          <section>
            <h4 className="text-lg font-semibold text-white mb-4 border-b border-[#122434] pb-2">Tracking & Action History</h4>
            
            {(!complaint.policeNotes || complaint.policeNotes.length === 0) ? (
              <div className="text-center p-6 bg-[#0b1628] rounded-xl border border-[#1d2d42] text-gray-400">
                Tracking file initialized. No police actions or notes have been logged yet.
              </div>
            ) : (
              <div className="space-y-4 ml-2 border-l-2 border-blue-900/50 pl-4 py-2 relative">
                {complaint.policeNotes.map((note, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-[#07121a]"></div>
                    
                    <div className="bg-[#0b1628] p-4 rounded-xl border border-[#1d2d42]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-blue-200 flex items-center gap-2">
                          <FiUser className="text-gray-400" /> {note.author || "Police Officer"}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FiClock /> {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">{note.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        
        <div className="mt-4 pt-4 border-t border-[#122434] flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
}
