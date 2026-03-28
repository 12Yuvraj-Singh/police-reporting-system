import express from "express";
import auth from "../middleware/auth.js";
import { 
  fileComplaint, 
  getUserComplaints, 
  getAllComplaints, 
  updateComplaintStatus 
} from "../controllers/complaintController.js";

const router = express.Router();

// Get all complaints (for police dashboard)
router.get("/all", auth, getAllComplaints);

// Fetch complaints for specific user
router.get("/user/:id", auth, getUserComplaints);

// Submit complaint
router.post("/", auth, fileComplaint);

// Update complaint status
router.put("/:id", auth, updateComplaintStatus);

export default router;
