import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import connectDB from "./db.js";
import { initSocket } from "./socket.js";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import policeRoutes from "./routes/policeRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import uploadRoutes from "./routes/upload.js";

console.log("ENV CHECK:", process.env.IMAGEKIT_PUBLIC_KEY);

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

connectDB();
initSocket(server);

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/police", policeRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/upload", uploadRoutes);


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
