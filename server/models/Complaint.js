import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  images: [String],
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedToStation: String,
  policeNotes: [{ text: String, author: String, createdAt: Date }],
  emergency: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Complaint", ComplaintSchema);
