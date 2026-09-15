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
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Time Off</h1>
          <p className="text-sm text-text-secondary">Requests from your team.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-light"
        >
          + Request Time Off
        </button>
      </div>

      {error && <div className="bg-danger-bg text-danger text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

      <div className="bg-surface rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-text-secondary">
              <th className="text-left px-4 py-3 font-medium">Staff</th>
              <th className="text-left px-3 py-3 font-medium">Dates</th>
              <th className="text-left px-3 py-3 font-medium">Reason</th>
              <th className="text-left px-3 py-3 font-medium">Status</th>
              {canReview && <th className="text-left px-3 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>Loading…</td></tr>
            ) : requests.length === 0 ? (
              <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>No requests found.</td></tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-text-primary">{r.staff_name}</td>
                  <td className="px-3 py-3 text-text-secondary">
                    {new Date(r.starts_on).toLocaleDateString()} – {new Date(r.ends_on).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3 text-text-secondary">{r.reason || "—"}</td>
                  <td className="px-3 py-3"><StatusPill status={r.status} /></td>
                  {canReview && (
                    <td className="px-3 py-3">
                      {r.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(r.id)} className="text-success text-xs font-medium hover:underline">
                            Approve
                          </button>
                          <button onClick={() => handleDeny(r.id)} className="text-danger text-xs font-medium hover:underline">
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
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-6 w-full max-w-sm space-y-3">
            <h2 className="font-semibold text-text-primary">Request Time Off</h2>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-secondary mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={form.startsOn}
                  onChange={(e) => setForm({ ...form, startsOn: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-text-secondary mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={form.endsOn}
                  onChange={(e) => setForm({ ...form, endsOn: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Reason</label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                rows={2}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-lg py-2 text-sm">
                Cancel
              </button>
              <button type="submit" className="flex-1 bg-primary text-white rounded-lg py-2 text-sm">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
