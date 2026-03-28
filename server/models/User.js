import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  role: { type: String, enum: ["citizen", "police"], required: true },
  aadhaarHash: String,
  phone: String,
  name: String,
  email: String,
  batchNo: String,
  passwordHash: { type: String, required: true },
  stationId: String,
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
