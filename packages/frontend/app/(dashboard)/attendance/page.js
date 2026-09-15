"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../lib/auth-context";
import { api } from "../../../lib/api";

function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

export default function AttendancePage() {
  const { storeId } = useAuth();
  const [date, setDate] = useState(formatDate(new Date()));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const data = await api.listAttendance(storeId, date);
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storeId, date]);

  useEffect(() => {
    load();
  }, [load]);

  function varianceLabel(minutes, flagged) {
    if (minutes === null || minutes === undefined) return "—";
    const sign = minutes > 0 ? "+" : "";
    return (
      <span className={`inline-flex items-center gap-1 ${flagged ? "text-danger font-semibold" : "text-success"}`}>
        {flagged && <span className="text-xs">!</span>}
        {sign}{minutes} min
      </span>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Attendance</h1>
          <p className="text-sm text-text-muted mt-1">Clock-ins, clock-outs, and variance tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
          />
          <a
            href={api.attendanceExportUrl(storeId, getWeekStart(new Date(date)).toISOString().split("T")[0])}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-sm font-medium text-white rounded-xl shadow-[0_4px_14px_rgba(91,141,239,0.3)] transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
          >
            Export CSV
          </a>
        </div>
      </div>

      {error && (
        <div className="bg-danger-bg text-danger text-sm rounded-xl px-4 py-2.5 mb-4 border border-danger/10">
          {error}
        </div>
      )}

      <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-x-auto border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-4 font-medium text-text-muted">Staff</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Scheduled</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Clocked</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Variance</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Flag</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-12 text-text-muted text-center" colSpan={5}>Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td className="px-5 py-12 text-text-muted text-center" colSpan={5}>No attendance records for this date.</td></tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className={`border-b border-gray-50 last:border-0 hover:bg-neutral/50 transition ${r.flagged ? "bg-danger-bg/30" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold">
                        {r.staff_name?.charAt(0)}
                      </div>
                      <span className="font-medium text-text-primary">{r.staff_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {r.scheduled_start
                      ? `${new Date(r.scheduled_start).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – ${new Date(r.scheduled_end).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {new Date(r.clock_in_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    {r.clock_out_at ? ` – ${new Date(r.clock_out_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : (
                      <span className="ml-1.5 inline-flex items-center gap-1 text-accent font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft"></span>
                        active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{varianceLabel(r.variance_minutes, r.flagged)}</td>
                  <td className="px-4 py-3">{r.flagged ? <span className="text-danger">!</span> : ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
