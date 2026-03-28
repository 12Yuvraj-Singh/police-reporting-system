import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import { io } from "../socket.js";

export const fileComplaint = async (req, res) => {
  console.log("POST /api/complaints - Start");
  try {
    const { userId, title, description, category, location, emergency, images } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location, // { latitude, longitude }
      images,
      userId: userId || req.user._id,
      assignedToStation: req.body.assignedToStation || "station-001",
      emergency: !!emergency
    });

    console.log("Complaint created:", complaint._id);
    await Notification.create({ title: "New complaint", body: `${title} - ${category}` });

    io.to("police").emit("complaint:created", complaint);
    io.to(`user:${req.user._id}`).emit("complaint:ack", { complaintId: complaint._id });

    console.log("POST /api/complaints - Success");
    res.status(201).json({ complaint });
  } catch (err) {
    console.error("POST /api/complaints - Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getUserComplaints = async (req, res) => {
  console.log(`GET /api/complaints/user/${req.params.id} - Start`);
  try {
    const complaints = await Complaint.find({ userId: req.params.id }).sort({ createdAt: -1 });
    console.log(`GET /api/complaints/user/${req.params.id} - Success, found ${complaints.length}`);
    res.json({ complaints });
  } catch (err) {
    console.error("GET /api/complaints/user/:id - Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getAllComplaints = async (req, res) => {
  console.log("GET /api/complaints/all - Start");
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name phone email")
      .sort({ createdAt: -1 });
    
    console.log(`GET /api/complaints/all - Success, found ${complaints.length}`);
    res.json({ complaints });
  } catch (err) {
    console.error("GET /api/complaints/all - Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  console.log(`PUT /api/complaints/${req.params.id} - Start`);
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      console.log(`PUT /api/complaints/${id} - Not found`);
      return res.status(404).json({ message: "Not found" });
    }

    if (status) complaint.status = status;
    if (note) {
      complaint.policeNotes.push({
        text: note,
        author: req.user.name || "Police Officer",
        createdAt: new Date()
      });
    }

    await complaint.save();
    console.log(`PUT /api/complaints/${id} - Success`);

    io.to(`user:${complaint.userId}`).emit("complaint:updated", complaint);
    io.to("police").emit("complaint:updated", complaint);

    res.json({ complaint });
  } catch (err) {
    console.error("PUT /api/complaints/:id - Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
