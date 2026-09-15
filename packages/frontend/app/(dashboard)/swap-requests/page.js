"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../lib/auth-context";
import { api } from "../../../lib/api";
import StatusPill from "../../../components/StatusPill";

const TABS = [
  { key: "", label: "All" },
  { key: "manager_review", label: "Pending Review" },
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Swap Requests</h1>
        <p className="text-sm text-text-muted mt-1">Review and manage shift swap requests.</p>
      </div>

      <div className="flex gap-1 mb-5 border-b border-gray-100">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition ${
              tab === t.key
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
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
              <th className="text-left px-5 py-4 font-medium text-text-muted">Employee</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Shift</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Reason</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Status</th>
              {canReview && <th className="text-left px-4 py-4 font-medium text-text-muted">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-12 text-text-muted text-center" colSpan={5}>Loading...</td></tr>
            ) : swaps.length === 0 ? (
              <tr><td className="px-5 py-12 text-text-muted text-center" colSpan={5}>No swap requests found.</td></tr>
            ) : (
              swaps.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-neutral/50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold">
                        {s.requested_by_name?.charAt(0)}
                      </div>
                      <span className="font-medium text-text-primary">{s.requested_by_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {new Date(s.starts_at).toLocaleDateString()} · {s.shift_position}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{s.reason || "—"}</td>
                  <td className="px-4 py-3"><StatusPill status={s.status} /></td>
                  {canReview && (
                    <td className="px-4 py-3">
                      {s.status === "manager_review" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleApprove(s.id)} className="text-success text-xs font-semibold hover:underline">
                            Approve
                          </button>
                          <button onClick={() => handleReject(s.id)} className="text-danger text-xs font-semibold hover:underline">
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
