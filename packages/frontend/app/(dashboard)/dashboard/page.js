"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../lib/auth-context";
import { api } from "../../../lib/api";

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

export default function DashboardPage() {
  const { storeId, user } = useAuth();
  const [stats, setStats] = useState({
    activeStaff: 0,
    pendingSwaps: 0,
    pendingTimeOff: 0,
    clockedIn: 0,
    totalStaff: 0,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const [staffList, swaps, timeOff, attendance] = await Promise.all([
        api.getStaffList(storeId),
        api.listSwaps(storeId, "manager_review"),
        api.listTimeOff(storeId),
        api.listAttendance(storeId, formatDate(new Date())),
      ]);

      const activeStaff = staffList.filter((s) => s.is_active).length;
      const pendingSwaps = swaps.length;
      const pendingTimeOff = timeOff.filter((r) => r.status === "pending").length;
      const clockedIn = attendance.filter((r) => !r.clock_out_at).length;

      setStats({
        activeStaff,
        pendingSwaps,
        pendingTimeOff,
        clockedIn,
        totalStaff: staffList.length,
      });
    } catch {
      // silently ignore — stats are best-effort
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    load();
  }, [load]);

  const cards = [
    { label: "Active Staff", value: stats.activeStaff, icon: "👥", color: "bg-accent/10 text-accent" },
    { label: "Pending Swaps", value: stats.pendingSwaps, icon: "🔄", color: "bg-warning-bg text-warning" },
    { label: "Pending Time Off", value: stats.pendingTimeOff, icon: "🏖️", color: "bg-accent-light/10 text-accent-light" },
    { label: "Clocked In Now", value: `${stats.clockedIn} / ${stats.totalStaff}`, icon: "⏱️", color: "bg-success-bg text-success" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Welcome back, {user?.fullName?.split(" ")[0] || "Manager"}
        </h1>
        <p className="text-sm text-text-muted mt-1">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${card.color}`}>
                {card.icon}
              </span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
              {loading ? "—" : card.value}
            </p>
            <p className="text-sm text-text-muted mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
        <h2 className="font-semibold text-text-primary mb-3">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="/schedule" className="block rounded-xl border border-gray-200 p-4 hover:border-accent/30 hover:bg-accent/5 transition text-sm font-medium text-text-primary">
            📅 View Schedule
          </a>
          <a href="/swap-requests" className="block rounded-xl border border-gray-200 p-4 hover:border-accent/30 hover:bg-accent/5 transition text-sm font-medium text-text-primary">
            🔄 Review Swaps
          </a>
          <a href="/time-off" className="block rounded-xl border border-gray-200 p-4 hover:border-accent/30 hover:bg-accent/5 transition text-sm font-medium text-text-primary">
            🏖️ Time Off Requests
          </a>
        </div>
      </div>
    </div>
  );
}
