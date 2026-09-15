"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../lib/auth-context";
import { api } from "../../../lib/api";
import StatusPill from "../../../components/StatusPill";

export default function TimeOffPage() {
  const { storeId, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startsOn: "", endsOn: "", reason: "" });

  const load = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const data = await api.listTimeOff(storeId);
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    load();
  }, [load]);

  const canReview = user?.role === "owner" || user?.role === "manager";

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.requestTimeOff(storeId, form);
      setShowForm(false);
      setForm({ startsOn: "", endsOn: "", reason: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleApprove(id) {
    try {
      await api.approveTimeOff(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeny(id) {
    try {
      await api.denyTimeOff(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Time Off</h1>
          <p className="text-sm text-text-muted mt-1">Manage time-off requests from your team.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm font-medium text-white rounded-xl shadow-[0_4px_14px_rgba(91,141,239,0.3)] transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
        >
          + Request Time Off
        </button>
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
              <th className="text-left px-4 py-4 font-medium text-text-muted">Dates</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Reason</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Status</th>
              {canReview && <th className="text-left px-4 py-4 font-medium text-text-muted">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-12 text-text-muted text-center" colSpan={5}>Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td className="px-5 py-12 text-text-muted text-center" colSpan={5}>No time-off requests found.</td></tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-neutral/50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold">
                        {r.staff_name?.charAt(0)}
                      </div>
                      <span className="font-medium text-text-primary">{r.staff_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {new Date(r.starts_on).toLocaleDateString()} – {new Date(r.ends_on).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{r.reason || "—"}</td>
                  <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                  {canReview && (
                    <td className="px-4 py-3">
                      {r.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(r.id)} className="text-success text-xs font-semibold hover:underline">
                            Approve
                          </button>
                          <button onClick={() => handleDeny(r.id)} className="text-danger text-xs font-semibold hover:underline">
                            Deny
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-[0_24px_60px_rgba(0,0,0,0.15)]">
            <h2 className="font-bold text-lg text-text-primary">Request Time Off</h2>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Start Date</label>
                <input
                  type="date"
                  required
                  value={form.startsOn}
                  onChange={(e) => setForm({ ...form, startsOn: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-secondary mb-1.5">End Date</label>
                <input
                  type="date"
                  required
                  value={form.endsOn}
                  onChange={(e) => setForm({ ...form, endsOn: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Reason</label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                rows={3}
              />
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
