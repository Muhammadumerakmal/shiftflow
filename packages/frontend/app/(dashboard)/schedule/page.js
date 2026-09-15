"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../lib/auth-context";
import { api } from "../../../lib/api";

function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SchedulePage() {
  const { storeId } = useAuth();
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [shifts, setShifts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ userId: "", day: 0, startTime: "09:00", endTime: "17:00", position: "" });

  const load = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    setError("");
    try {
      const [shiftData, staffData] = await Promise.all([
        api.getWeekSchedule(storeId, formatDate(weekStart)),
        api.getStaffList(storeId),
      ]);
      setShifts(shiftData);
      setStaff(staffData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storeId, weekStart]);

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

  function shiftsFor(userId, day) {
    return shifts.filter((s) => {
      if (s.user_id !== userId) return false;
      const d = new Date(s.starts_at);
      return d.toDateString() === day.toDateString();
    });
  }

  async function handleCreateShift(e) {
    e.preventDefault();
    const day = shiftDays()[form.day];
    const startsAt = new Date(day);
    const [sh, sm] = form.startTime.split(":");
    startsAt.setHours(Number(sh), Number(sm), 0, 0);
    const endsAt = new Date(day);
    const [eh, em] = form.endTime.split(":");
    endsAt.setHours(Number(eh), Number(em), 0, 0);

    try {
      await api.createShift(storeId, {
        userId: form.userId,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        position: form.position,
      });
      setShowForm(false);
      setForm({ userId: "", day: 0, startTime: "09:00", endTime: "17:00", position: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePublish() {
    try {
      await api.publishWeek(storeId, formatDate(weekStart));
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const draftCount = shifts.filter((s) => s.status === "draft").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Weekly Schedule</h1>
          <p className="text-sm text-text-secondary">
            {weekStart.toDateString()} — {shiftDays()[6].toDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() - 7); return d; })}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-surface hover:bg-neutral"
          >
            ← Prev
          </button>
          <button
            onClick={() => setWeekStart((w) => { const d = new Date(w); d.setDate(d.getDate() + 7); return d; })}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-surface hover:bg-neutral"
          >
            Next →
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-light"
          >
            + New Shift
          </button>
          {draftCount > 0 && (
            <button
              onClick={handlePublish}
              className="px-3 py-1.5 text-sm bg-success text-white rounded-lg hover:opacity-90"
            >
              Publish ({draftCount} draft{draftCount > 1 ? "s" : ""})
            </button>
          )}
        </div>
      </div>

      {error && <div className="bg-danger-bg text-danger text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

      {loading ? (
        <p className="text-text-secondary text-sm">Loading schedule…</p>
      ) : (
        <div className="bg-surface rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-text-secondary w-40">Staff</th>
                {shiftDays().map((d, i) => (
                  <th key={i} className="text-left px-3 py-3 font-medium text-text-secondary">
                    {DAY_LABELS[i]} <span className="font-normal">{d.getDate()}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.user_id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-text-primary">{member.full_name}</td>
                  {shiftDays().map((day, i) => {
                    const dayShifts = shiftsFor(member.user_id, day);
                    return (
                      <td key={i} className="px-3 py-3 align-top">
                        {dayShifts.map((s) => (
                          <div
                            key={s.id}
                            className={`rounded-md px-2 py-1 mb-1 text-xs ${
                              s.status === "published"
                                ? "bg-success-bg text-success border border-success/20"
                                : "bg-gray-50 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {new Date(s.starts_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}–
                            {new Date(s.ends_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                            <div className="text-[10px] opacity-70">{s.position}</div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form onSubmit={handleCreateShift} className="bg-surface rounded-xl p-6 w-full max-w-sm space-y-3">
            <h2 className="font-semibold text-text-primary">New Shift</h2>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Staff</label>
              <select
                required
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select staff</option>
                {staff.map((s) => (
                  <option key={s.user_id} value={s.user_id}>{s.full_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Day</label>
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {DAY_LABELS.map((label, i) => (
                  <option key={i} value={i}>{label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-secondary mb-1">Start</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-secondary mb-1">End</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Position</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="Cashier, Manager…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-lg py-2 text-sm">
                Cancel
              </button>
              <button type="submit" className="flex-1 bg-primary text-white rounded-lg py-2 text-sm">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
