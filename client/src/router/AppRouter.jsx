import { Routes, Route } from "react-router-dom";
import CitizenLogin from "../pages/Auth/CitizenLogin";
import PoliceDashboard from "../pages/Police/PoliceDashboard";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import Landing from "../pages/Landing";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<CitizenLogin />} />

      <Route path="/police" element={
        <ProtectedRoute role="police">
          <PoliceDashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}
