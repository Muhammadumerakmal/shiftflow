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
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Staff</h1>
          <p className="text-sm text-text-secondary">Manage your team.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-light"
        >
          + Invite Staff
        </button>
      </div>

      {error && <div className="bg-danger-bg text-danger text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

      <div className="bg-surface rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-text-secondary">
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-3 py-3 font-medium">Position</th>
              <th className="text-left px-3 py-3 font-medium">Status</th>
              <th className="text-left px-3 py-3 font-medium">Can Open</th>
              <th className="text-left px-3 py-3 font-medium">Can Close</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>Loading…</td></tr>
            ) : staff.length === 0 ? (
              <tr><td className="px-4 py-6 text-text-secondary" colSpan={5}>No staff yet.</td></tr>
            ) : (
              staff.map((s) => (
                <tr key={s.user_id} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-text-primary">{s.full_name}</td>
                  <td className="px-3 py-3 text-text-secondary capitalize">{s.position}</td>
                  <td className="px-3 py-3">
                    <span className={`status-pill ${s.is_active ? "bg-success-bg text-success" : "bg-gray-100 text-gray-600"}`}>
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-3">{s.can_open ? "✓" : "—"}</td>
                  <td className="px-3 py-3">{s.can_close ? "✓" : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-6 w-full max-w-sm space-y-3">
            <h2 className="font-semibold text-text-primary">Invite Staff</h2>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Phone</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+15551234567"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Position</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="Cashier, Stock Associate…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-lg py-2 text-sm">
                Cancel
              </button>
              <button type="submit" className="flex-1 bg-primary text-white rounded-lg py-2 text-sm">
                Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
