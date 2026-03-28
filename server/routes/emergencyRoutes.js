import express from "express";
import auth from "../middleware/auth.js";
import { emergencyAlert } from "../controllers/emergencyController.js";

const router = express.Router();

router.post("/", auth, emergencyAlert);

export default router;
