import Complaint from "../models/Complaint.js";
import { io } from "../socket.js";

export const emergencyAlert = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      title: "Emergency Help",
      description: req.body.message || "Help requested",
      category: "emergency",
      location: `${req.body.lat},${req.body.lng}`,
      citizen: req.user._id,
      assignedToStation: "station-001",
      emergency: true
    });

    io.to("station:station-001").emit("emergency:alert", complaint);
    io.to(`user:${req.user._id}`).emit("emergency:ack", complaint);

    res.status(201).json({ complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
