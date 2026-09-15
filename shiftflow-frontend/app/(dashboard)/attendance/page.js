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
      <span className={flagged ? "text-danger font-medium" : "text-success"}>
        {sign}{minutes} min
      </span>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Attendance</h1>
          <p className="text-sm text-text-secondary">Clock-ins, clock-outs, and variance.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
          />
          <a
            href={api.attendanceExportUrl(storeId, getWeekStart(new Date(date)).toISOString().split("T")[0])}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-light"
          >
            Export CSV
          </a>
        </div>
      </div>

      {error && <div className="bg-danger-bg text-danger text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

      <div className="bg-surface rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-text-secondary">
              <th className="text-left px-4 py-3 font-medium">Staff</th>
              <th className="text-left px-3 py-3 font-medium">Scheduled</th>
              <th className="text-left px-3 py-3 font-medium">Clocked</th>
              <th className="text-left px-3 py-3 font-medium">Variance</th>
              <th className="text-left px-3 py-3 font-medium">Flag</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>Loading…</td></tr>
            ) : records.length === 0 ? (
              <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>No attendance records for this date.</td></tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-text-primary">{r.staff_name}</td>
                  <td className="px-3 py-3 text-text-secondary">
                    {r.scheduled_start
                      ? `${new Date(r.scheduled_start).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – ${new Date(r.scheduled_end).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
                      : "—"}
                  </td>
                  <td className="px-3 py-3 text-text-secondary">
                    {new Date(r.clock_in_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    {r.clock_out_at ? ` – ${new Date(r.clock_out_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : " (active)"}
                  </td>
                  <td className="px-3 py-3">{varianceLabel(r.variance_minutes, r.flagged)}</td>
                  <td className="px-3 py-3">{r.flagged ? "🚩" : ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
