"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../lib/auth-context";
import { api } from "../../../lib/api";
import StatusPill from "../../../components/StatusPill";

const TABS = [
  { key: "", label: "All Requests" },
  { key: "manager_review", label: "Pending My Review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function SwapRequestsPage() {
  const { storeId, user } = useAuth();
  const [tab, setTab] = useState("");
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const data = await api.listSwaps(storeId, tab || undefined);
      setSwaps(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storeId, tab]);

  useEffect(() => {
    load();
  }, [load]);

  const canReview = user?.role === "owner" || user?.role === "manager";

  async function handleApprove(id) {
    try {
      await api.approveSwap(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReject(id) {
    try {
      await api.rejectSwap(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-text-primary">Manage Requests</h1>
        <p className="text-sm text-text-secondary">Review and approve employee shift swaps.</p>
      </div>

      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t.key ? "border-primary text-primary" : "border-transparent text-text-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="bg-danger-bg text-danger text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

      <div className="bg-surface rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-text-secondary">
              <th className="text-left px-4 py-3 font-medium">Employee</th>
              <th className="text-left px-3 py-3 font-medium">Shift</th>
              <th className="text-left px-3 py-3 font-medium">Reason</th>
              <th className="text-left px-3 py-3 font-medium">Status</th>
              {canReview && <th className="text-left px-3 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>Loading…</td></tr>
            ) : swaps.length === 0 ? (
              <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>No requests found.</td></tr>
            ) : (
              swaps.map((s) => (
                <tr key={s.id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-text-primary">{s.requested_by_name}</td>
                  <td className="px-3 py-3 text-text-secondary">
                    {new Date(s.starts_at).toLocaleDateString()} · {s.shift_position}
                  </td>
                  <td className="px-3 py-3 text-text-secondary">{s.reason || "—"}</td>
                  <td className="px-3 py-3"><StatusPill status={s.status} /></td>
                  {canReview && (
                    <td className="px-3 py-3">
                      {s.status === "manager_review" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(s.id)} className="text-success text-xs font-medium hover:underline">
                            Approve
                          </button>
                          <button onClick={() => handleReject(s.id)} className="text-danger text-xs font-medium hover:underline">
                            Reject
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
    </div>
  );
}
