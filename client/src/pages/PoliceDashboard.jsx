import React, { useEffect, useState, useContext } from "react";
import StatCard from "../components/police/StatCard";
import ModuleCard from "../components/police/ModuleCard";
import CaseManagement from "./CaseManagement";
import FIRRecords from "./FIRRecords";
import AlertPanel from "../components/police/AlertPanel";
import axios from "../api/axios";
import { POLICE } from "../api/endpoints";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";

export default function PoliceDashboard() {
  const [view, setView] = useState("overview"); // 'overview' | 'cases' | 'firs'
  const [stats, setStats] = useState({ newCases: 0, active: 0, resolvedToday: 0, responseTime: "—" });
  const [alerts, setAlerts] = useState([]);
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(POLICE.LIST);
        const complaints = res.data.complaints || [];
        // compute basic stats
        const newCases = complaints.filter(c => c.status === "Pending").length;
        const active = complaints.filter(c => c.status === "In Progress").length;
        const resolvedToday = complaints.filter(c => {
          if (!c.updatedAt) return false;
          const d = new Date(c.updatedAt);
          const today = new Date(); return d.toDateString() === today.toDateString() && c.status === "Resolved";
        }).length;
        setStats({ newCases, active, resolvedToday, responseTime: "18m" });

        // set some sample alerts from data (emergency etc)
        const em = complaints.filter(c => c.emergency).slice(0,3).map(c => ({ title: "Emergency Alert", body: c.title, time: "Just now" }));
        setAlerts(em);
      } catch (err) {
        console.warn(err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("complaint:created", (c) => {
      setStats(s => ({ ...s, newCases: s.newCases + 1 }));
      setAlerts(a => [{ title: "New Case", body: c.title, time: "Just now" }, ...a].slice(0,5));
    });
    socket.on("complaint:updated", (c) => {
      // reload small stats or mutate
      // simplistic: just recalc by fetching list again or adjust counts
    });

    return () => {
      socket?.off("complaint:created");
      socket?.off("complaint:updated");
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-[#0b1320] text-white pb-20">
      {/* top hero */}
      <div className="px-6 pt-6">
        <div className="bg-gradient-to-r from-[#2b4b8a] to-[#3e3fa9] rounded-xl p-8 h-[200px]">
          <div className="text-center items-center flex flex-col justify-center h-full">
            <div className="text-4xl font-bold">INDIA</div>
            <div className="text-xl mt-2">Serving with Honor, Protecting with Technology</div>
            <div className="text-sm opacity-80 mt-1">Digital Command Center - Indian Police Force</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8">

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <StatCard label="New Cases" value={stats.newCases} accent />
          <StatCard label="Active Cases" value={stats.active} />
          <StatCard label="Resolved Today" value={stats.resolvedToday} />
          <StatCard label="Response Time" value={stats.responseTime} />
        </div>

        {/* Modules row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <ModuleCard title="Case Management" subtitle="Manage and assign cases" icon="⚖️" onClick={() => setView("cases")} />
          <ModuleCard title="FIR Records" subtitle="Access & update FIR DB" icon="📁" onClick={() => setView("firs")} />
          <ModuleCard title="Analytics & Reports" subtitle="Crime statistics & trends" icon="📈" onClick={() => setView("reports")} />
        </div>

        {/* content area */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {view === "overview" && (
              <div className="p-6 rounded-xl bg-[#071122] border border-[#122434]">
                <h3 className="font-semibold mb-3">Overview</h3>
                <p className="text-gray-300">Quick insights and recent cases.</p>
              </div>
            )}

            {view === "cases" && <CaseManagement />}

            {view === "firs" && <FIRRecords />}
            {view === "reports" && <div className="p-6 rounded-xl bg-[#071122]">Reports coming soon</div>}
          </div>

          <div>
            <AlertPanel alerts={alerts} />
          </div>
        </div>
      </div>
    </div>
  );
}
