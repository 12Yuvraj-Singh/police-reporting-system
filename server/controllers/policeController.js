import Complaint from "../models/Complaint.js";
import { io } from "../socket.js";

export const getStationComplaints = async (req, res) => {
  try {
    const station = req.user.stationId;
    const complaints = await Complaint.find({ assignedToStation: station }).populate("citizen", "name phone");
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Not found" });

    if (status) complaint.status = status;

    if (note)
      complaint.policeNotes.push({
        text: note,
        author: req.user.name,
        createdAt: new Date()
      });

    await complaint.save();

    io.to(`user:${complaint.citizen}`).emit("complaint:updated", complaint);
    io.to(`station:${complaint.assignedToStation}`).emit("complaint:updated", complaint);

    res.json({ complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
