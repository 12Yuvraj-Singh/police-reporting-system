import express from "express";
import auth from "../middleware/auth.js";
import { getStationComplaints, updateComplaint } from "../controllers/policeController.js";

const router = express.Router();

router.get("/complaints", auth, getStationComplaints);
router.post("/complaints/:id/update", auth, updateComplaint);

export default router;
