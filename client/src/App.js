import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import SocketProvider from "./context/SocketContext";
import Navbar from "./components/navbar/Navbar";
import CitizenHome from "./pages/CitizenHome";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FileComplaint from "./pages/FileComplaint";
import PoliceDashboard from "./pages/PoliceDashboard";
import TrackComplaint from "./pages/Citizen/TrackComplaint";
import ViewStatus from "./pages/Citizen/ViewStatus";
import Notifications from "./pages/Citizen/Notifications";
import EmergencyHelp from "./pages/Citizen/EmergencyHelp";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* New Auth Flows */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Dashboards */}
            <Route path="/citizen/home" element={<CitizenHome />} />
            <Route path="/police" element={<PoliceDashboard />} />
            <Route path="/police/home" element={<PoliceDashboard />} />
            
            {/* Features */}
            <Route path="/file" element={<FileComplaint />} />
            <Route path="/track" element={<TrackComplaint />} />
            <Route path="/status" element={<ViewStatus />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/emergency" element={<EmergencyHelp />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}
