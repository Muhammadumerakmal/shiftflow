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

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MySchedulePage() {
  const { storeId, user } = useAuth();
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!storeId || !user?.id) return;
    setLoading(true);
    try {
      const all = await api.getWeekSchedule(storeId, formatDate(weekStart));
      setShifts(all.filter((s) => s.user_id === user.id));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [storeId, weekStart, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  function shiftDays() {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-text-primary">My Schedule</h1>
        <div className="flex gap-1">
          <button
            onClick={() => setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() - 7); return d; })}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-surface hover:bg-neutral transition"
          >
            ← Prev
          </button>
          <button
            onClick={() => setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() + 7); return d; })}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-surface hover:bg-neutral transition"
          >
            Next →
          </button>
        </div>
      </div>

      <p className="text-xs text-text-muted mb-4">
        {weekStart.toDateString()} — {shiftDays()[6].toDateString()}
      </p>

      {loading ? (
        <div className="text-center py-12 text-text-muted text-sm">Loading...</div>
      ) : shifts.length === 0 ? (
        <div className="text-center py-12 text-text-muted text-sm">No shifts this week.</div>
      ) : (
        <div className="space-y-2">
          {shiftDays().map((day, i) => {
            const dayShifts = shifts.filter((s) => {
              const d = new Date(s.starts_at);
              return d.toDateString() === day.toDateString();
            });
            if (dayShifts.length === 0) return null;
            return (
              <div key={i} className="bg-surface rounded-xl border border-gray-100 p-3">
                <p className="text-xs font-medium text-text-muted mb-2">
                  {DAY_LABELS[i]}, {day.toLocaleDateString([], { month: "short", day: "numeric" })}
                </p>
                {dayShifts.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-1.5">
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {new Date(s.starts_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} – {new Date(s.ends_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </p>
                      {s.position && <p className="text-xs text-text-muted">{s.position}</p>}
                    </div>
                    <span className={`status-pill text-[10px] ${s.status === "published" ? "bg-success-bg text-success" : "bg-gray-100 text-gray-600"}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
