import express from "express";
import { 
  registerUser, 
  sendOtp,
  verifyUser, 
  resetPassword, 
  loginAdmin, 
  registerPolice,
  otpLogin
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);           // Citizen Registration
router.post("/send-otp", sendOtp);                // Gen & Console Log OTP
router.post("/verify-user", verifyUser);          // Verify OTP success (logs in)
router.post("/otp-login", otpLogin);              // Handle Firebase OTP login
router.post("/reset-password", resetPassword);    // Set New Password
router.post("/login", loginAdmin);                // Admin (Police) Login
router.post("/register-police", registerPolice);  // Provisioning

export default router;
