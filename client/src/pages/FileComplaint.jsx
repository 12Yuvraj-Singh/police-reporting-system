import React, { useState } from "react";
import axios from "../api/axios";
import { FiEdit3, FiMapPin, FiLayers, FiFileText, FiImage, FiX } from "react-icons/fi";

export default function FileComplaint() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  const [coordinates, setCoordinates] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const [images, setImages] = useState([]); 
  const [uploading, setUploading] = useState(false);
  const [successId, setSuccessId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGettingLocation(false);
      },
      (error) => {
        alert("Unable to retrieve location: " + error.message);
        setGettingLocation(false);
      }
    );
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      return alert("Maximum 5 images allowed");
    }
    setImages([...images, ...files]);
  };

  const removeImage = (i) => {
    setImages(images.filter((_, idx) => idx !== i));
  };

  const uploadImages = async () => {
  if (images.length === 0) return [];

  let uploaded = [];

  for (const file of images) {
    // 1. Get auth params
    const { data: auth } = await axios.get("/api/upload/auth");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", `complaint-${Date.now()}-${file.name}`);
    formData.append("signature", auth.signature);
    formData.append("token", auth.token);
    formData.append("expire", auth.expire);
    formData.append("publicKey", auth.publicKey);
    formData.append("folder", "/complaints");

    const uploadRes = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    if (uploadRes.url) {
      uploaded.push(uploadRes.url);
    } else {
      console.log("UPLOAD ERROR:", uploadRes);
    }
  }

  return uploaded;
};

  const submit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const uploadedUrls = await uploadImages(); // ← REAL URLs

    const finalDescription = form.location 
      ? `${form.description}\n\nIncident Address: ${form.location}` 
      : form.description;

    const res = await axios.post("/api/complaints", {
      title: form.title,
      description: finalDescription,
      category: form.category,
      location: coordinates ? { latitude: coordinates.lat, longitude: coordinates.lng } : null,
      images: uploadedUrls,
    });

    setSuccessId(res.data.complaint._id);
    setForm({ title: "", description: "", category: "", location: "" });
    setCoordinates(null);
    setImages([]);
  } catch (err) {
    alert(err.response?.data?.error || err.message);
  }

  setLoading(false);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8eef7] to-[#f7f9fb] pt-24 pb-16 px-5">

      {/* Title */}
      <div className="text-center mb-10 animate-fadeIn">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 drop-shadow-sm">
          📝 File a Complaint
        </h1>
        <p className="text-gray-600 mt-2 text-sm">
          Your report helps us respond faster and serve you better
        </p>
      </div>

      {/* Glass Card */}
      <div className="max-w-4xl mx-auto p-10 rounded-3xl glass-card shadow-2xl animate-slideUp">

        {/* Success */}
        {successId && (
          <div className="p-4 mb-5 bg-green-100 border border-green-400 rounded-xl text-green-800 font-medium animate-pop">
            Complaint submitted successfully ✔  
            <br />
            <span className="font-bold">ID: {successId}</span>
          </div>
        )}

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-7">

          {/* Title */}
          <Field
            icon={<FiEdit3 />}
            label="Complaint Title"
            placeholder="Enter complaint title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          {/* Category */}
          <FieldSelect
            icon={<FiLayers />}
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={[
              "Theft", "Harassment", "Cyber Crime",
              "Violence", "Missing Person", "Fraud", "Other"
            ]}
          />

          {/* Description */}
          <div className="col-span-1 md:col-span-2">
            <FieldTextArea
              icon={<FiFileText />}
              label="Description"
              placeholder="Provide detailed description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Location */}
          <div className="w-full">
            <Field
              icon={<FiMapPin />}
              label="Location"
              placeholder="Enter location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <div className="mt-2 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                {gettingLocation ? "Fetching GPS..." : "📍 Use my current GPS location"}
              </button>
              {coordinates && (
                <span className="text-xs text-green-600 font-semibold">✓ Location captured</span>
              )}
            </div>
          </div>

          {/* ================= IMAGE UPLOAD ================= */}
          <div className="w-full md:col-span-2">
            <label className="text-gray-700 font-semibold text-sm mb-1 block">
              Upload Images (optional)
            </label>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-white/80 shadow-sm transition">
              <FiImage className="text-xl text-gray-600" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* PREVIEW */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img alt="preview"
                      src={URL.createObjectURL(img)}
                      className="w-28 h-28 rounded-xl shadow object-cover"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full text-xs"
                      onClick={() => removeImage(i)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploading && (
              <p className="text-blue-500 text-sm mt-2">Uploading images…</p>
            )}
          </div>

          {/* Submit */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              disabled={loading}
              className="w-full md:w-1/2 py-3 rounded-xl text-white font-bold text-lg tracking-wide 
                         bg-gradient-to-r from-blue-600 to-blue-500 
                         shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all
                         disabled:bg-gray-400 disabled:scale-100"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>

        </form>
      </div>

      {/* Styles */}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.35);
        }
      `}</style>
    </div>
  );
}

/* COMPONENTS — unchanged from your code */

const Field = ({ icon, label, ...props }) => (
  <div className="w-full">
    <label className="text-gray-700 font-semibold text-sm mb-1 block">{label}</label>
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-white/80 
                    focus-within:border-blue-500 shadow-sm transition">
      <span className="text-xl text-gray-600">{icon}</span>
      <input className="w-full outline-none bg-transparent" {...props} required />
    </div>
  </div>
);

const FieldTextArea = ({ icon, label, ...props }) => (
  <div className="w-full">
    <label className="text-gray-700 font-semibold text-sm mb-1 block">{label}</label>
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-white/80 
                    focus-within:border-blue-500 shadow-sm transition">
      <span className="text-xl text-gray-600 mt-1">{icon}</span>
      <textarea className="w-full outline-none bg-transparent min-h-[120px]" {...props} required />
    </div>
  </div>
);

const FieldSelect = ({ icon, label, options, ...props }) => (
  <div className="w-full">
    <label className="text-gray-700 font-semibold text-sm mb-1 block">{label}</label>
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-300 bg-white/80 
                    focus-within:border-blue-500 shadow-sm transition">
      <span className="text-xl text-gray-600">{icon}</span>
      <select className="w-full outline-none bg-transparent" {...props} required>
        <option value="">Select category</option>
        {options.map((opt) => (
          <option key={opt} value={opt.toLowerCase()}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);
