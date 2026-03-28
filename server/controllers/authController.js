import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// IN-MEMORY OTP STORE FOR LOCAL TESTING WITHOUT FIREBASE
const otpStore = new Map(); // phone -> { otp, expiresAt }

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number required" });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 min expiry

    console.log(`\n=============================================`);
    console.log(`📱 MOCK SMS DEV SYSTEM`);
    console.log(`📩 OTP for ${phone} is: [ ${otp} ]`);
    console.log(`=============================================\n`);

    res.json({ message: "OTP sent successfully! (Check your server console)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const otpLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number required" });

    let user = await User.findOne({ phone });

    if (!user) {
      // Create user if not exists as per requirements
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await User.create({
        role: "citizen",
        name: "Citizen",
        phone,
        passwordHash: dummyPassword,
        isVerified: true
      });
    } else if (!user.isVerified) {
      // If user registered earlier but never verified
      user.isVerified = true;
      await user.save();
    }

    res.json({ message: "Logged in successfully", user, token: createToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const existing = await User.findOne({ phone });
    if (existing) {
      if (existing.isVerified) {
        return res.status(400).json({ message: "Phone number already registered and verified." });
      } else {
        existing.name = name;
        existing.passwordHash = await bcrypt.hash(password, 10);
        await existing.save();
        return res.json({ message: "Updated unverified registration.", user: existing });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      role: "citizen",
      name,
      phone,
      passwordHash,
      isVerified: false
    });

    res.json({ message: "Registered successfully. Please login to verify OTP.", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    // Verify OTP explicitly
    const record = otpStore.get(phone);
    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    user.isVerified = true;
    await user.save();
    
    // Clear OTP
    otpStore.delete(phone);

    res.json({ message: "Verified successfully", user, token: createToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    
    // Verify OTP explicitly
    const record = otpStore.get(phone);
    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ phone });
    
    if (!user) return res.status(404).json({ message: "User not found" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Clear OTP
    otpStore.delete(phone);

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Support either email or batchNo to ensure police can still log in
    const user = await User.findOne({ 
      $or: [{ email: email }, { batchNo: email }],
      role: "police" 
    });

    if (!user) return res.status(400).json({ message: "Invalid admin credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid admin credentials" });

    // Output token
    res.json({ user, token: createToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerPolice = async (req, res) => {
  try {
    const { name, batchNo, email, password, stationId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      role: "police",
      name,
      batchNo,
      email,
      passwordHash,
      stationId,
      isVerified: true
    });

    res.json({ user, token: createToken(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
