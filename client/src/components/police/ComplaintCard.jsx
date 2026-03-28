import React, { useState } from "react";
import { FiMapPin, FiClock, FiImage } from "react-icons/fi";

export default function ComplaintCard({ complaint, onOpen, onTrack }) {
  const [viewImage, setViewImage] = useState(null);

  const {
    title,
    description,
    category,
    location,
    status,
    images = [],
    createdAt,
  } = complaint;

  return (
    <>
      <div className="bg-[#0b1628] border border-[#1d2d42] rounded-xl p-5 shadow-lg hover:bg-[#0f1d33] transition">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-gray-400 text-sm capitalize">{category}</p>
          </div>

          {/* Status */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === "Pending"
                ? "bg-blue-600/30 text-blue-300"
                : status === "In Progress"
                ? "bg-yellow-600/30 text-yellow-300"
                : "bg-green-600/30 text-green-300"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Location + Time */}
        <div className="flex items-center text-gray-400 text-sm gap-2 mb-4">
          <FiMapPin className="text-blue-300" />
          {location && location.latitude ? `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}` : "GPS data unavailable"}
        </div>

        <div className="flex items-center text-gray-500 text-xs gap-2 mb-4">
          <FiClock />
          {new Date(createdAt).toLocaleString()}
        </div>

        {/* IMAGES SECTION */}
        {images.length > 0 && (
          <div className="flex gap-3 mb-4 overflow-x-auto scrollbar-hide">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setViewImage(img)}
                className="cursor-pointer group"
              >
                <img
                  src={img}
                  alt="Evidence"
                  className="w-20 h-20 object-cover rounded-lg border border-[#1d2d42] group-hover:opacity-80 transition"
                />
              </div>
            ))}
          </div>
        )}

        {/* No Images */}
        {images.length === 0 && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FiImage /> No evidence uploaded
          </div>
        )}

        {/* BUTTONS */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onTrack && onTrack(complaint)}
            className="flex-1 px-4 py-2 rounded-lg bg-[#122434] text-blue-200 border border-[#1d2d42] hover:bg-[#1d2d42] transition font-semibold"
          >
            Track File
          </button>
          <button
            onClick={() => onOpen && onOpen(complaint)}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition font-semibold"
          >
            Update Status
          </button>
        </div>
      </div>

      {/* IMAGE VIEW MODAL */}
      {viewImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setViewImage(null)}
        >
          <img
            src={viewImage}
            alt="full"
            className="max-w-3xl max-h-[85vh] rounded-xl shadow-2xl border border-gray-600"
          />
        </div>
      )}
    </>
  );
}
