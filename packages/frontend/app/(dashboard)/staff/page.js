"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../lib/auth-context";
import { api } from "../../../lib/api";

export default function StaffPage() {
  const { storeId } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ phone: "", fullName: "", position: "" });

  const load = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const data = await api.getStaffList(storeId);
      setStaff(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.inviteStaff(storeId, form);
      setShowForm(false);
      setForm({ phone: "", fullName: "", position: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Staff</h1>
          <p className="text-sm text-text-muted mt-1">Manage your team members.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm font-medium text-white rounded-xl shadow-[0_4px_14px_rgba(91,141,239,0.3)] transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
        >
          + Invite Staff
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
              <th className="text-left px-5 py-4 font-medium text-text-muted">Name</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Position</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Status</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Open</th>
              <th className="text-left px-4 py-4 font-medium text-text-muted">Close</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-12 text-text-muted text-center" colSpan={5}>Loading...</td></tr>
            ) : staff.length === 0 ? (
              <tr><td className="px-5 py-12 text-text-muted text-center" colSpan={5}>No staff yet. Invite your first team member.</td></tr>
            ) : (
              staff.map((s) => (
                <tr key={s.user_id} className="border-b border-gray-50 last:border-0 hover:bg-neutral/50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold">
                        {s.full_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{s.full_name}</div>
                        <div className="text-xs text-text-muted">{s.email || s.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary capitalize">{s.position || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`status-pill ${s.is_active ? "bg-success-bg text-success" : "bg-gray-100 text-gray-600"}`}>
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={s.can_open ? "text-success" : "text-text-muted"}>
                      {s.can_open ? "✓" : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={s.can_close ? "text-success" : "text-text-muted"}>
                      {s.can_close ? "✓" : "—"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-[0_24px_60px_rgba(0,0,0,0.15)]">
            <h2 className="font-bold text-lg text-text-primary">Invite Staff</h2>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Phone</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+15551234567"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Position</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="Cashier, Stock Associate..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-neutral transition">
                Cancel
              </button>
              <button type="submit" className="flex-1 text-white rounded-xl py-2.5 text-sm font-medium shadow-[0_4px_14px_rgba(91,141,239,0.3)] transition hover:opacity-90" style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}>
                Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
