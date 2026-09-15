"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../lib/auth-context";
import { api } from "../../../lib/api";
import StatusPill from "../../../components/StatusPill";

export default function MyRequestsPage() {
  const { storeId, user } = useAuth();
  const [tab, setTab] = useState("swaps");
  const [swaps, setSwaps] = useState([]);
  const [timeOff, setTimeOff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startsOn: "", endsOn: "", reason: "" });

  const load = useCallback(async () => {
    if (!storeId || !user?.id) return;
    setLoading(true);
    try {
      const [allSwaps, allTimeOff] = await Promise.all([
        api.listSwaps(storeId),
        api.listTimeOff(storeId),
      ]);
      setSwaps(allSwaps.filter((s) => s.requested_by === user.id));
      setTimeOff(allTimeOff.filter((r) => r.user_id === user.id));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [storeId, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRequestTimeOff(e) {
    e.preventDefault();
    try {
      await api.requestTimeOff(storeId, form);
      setShowForm(false);
      setForm({ startsOn: "", endsOn: "", reason: "" });
      load();
    } catch {
      // silent
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-text-primary">My Requests</h1>
      </div>

      <div className="flex gap-1 mb-4 border-b border-gray-100">
        <button
          onClick={() => setTab("swaps")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
            tab === "swaps" ? "border-accent text-accent" : "border-transparent text-text-muted"
          }`}
        >
          Swaps
        </button>
        <button
          onClick={() => setTab("time-off")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
            tab === "time-off" ? "border-accent text-accent" : "border-transparent text-text-muted"
          }`}
        >
          Time Off
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted text-sm">Loading...</div>
      ) : tab === "swaps" ? (
        swaps.length === 0 ? (
          <div className="text-center py-12 text-text-muted text-sm">No swap requests yet.</div>
        ) : (
          <div className="space-y-2">
            {swaps.map((s) => (
              <div key={s.id} className="bg-surface rounded-xl border border-gray-100 p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-text-primary">{s.shift_position || "Shift"}</p>
                  <StatusPill status={s.status} />
                </div>
                <p className="text-xs text-text-muted">
                  {new Date(s.starts_at).toLocaleDateString()} · {s.reason || "No reason"}
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        <>
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setShowForm(true)}
              className="px-3 py-1.5 text-xs font-medium text-white rounded-lg shadow-[0_4px_14px_rgba(91,141,239,0.3)] transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
            >
              + New Request
            </button>
          </div>
          {timeOff.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-sm">No time-off requests yet.</div>
          ) : (
            <div className="space-y-2">
              {timeOff.map((r) => (
                <div key={r.id} className="bg-surface rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-text-primary">
                      {new Date(r.starts_on).toLocaleDateString()} – {new Date(r.ends_on).toLocaleDateString()}
                    </p>
                    <StatusPill status={r.status} />
                  </div>
                  {r.reason && <p className="text-xs text-text-muted">{r.reason}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
          <form onSubmit={handleRequestTimeOff} className="bg-surface rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h2 className="font-bold text-lg text-text-primary">Request Time Off</h2>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Start</label>
                <input type="date" required value={form.startsOn} onChange={(e) => setForm({ ...form, startsOn: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-secondary mb-1.5">End</label>
                <input type="date" required value={form.endsOn} onChange={(e) => setForm({ ...form, endsOn: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Reason</label>
              <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition" rows={2} />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-neutral transition">
                Cancel
              </button>
              <button type="submit" className="flex-1 text-white rounded-xl py-2.5 text-sm font-medium shadow-[0_4px_14px_rgba(91,141,239,0.3)] transition hover:opacity-90" style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}>
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
