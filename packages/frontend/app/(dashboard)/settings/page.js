"use client";

import { useAuth } from "../../../lib/auth-context";

export default function SettingsPage() {
  const { user, storeId } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Account and store information.</p>
      </div>

      <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 max-w-lg space-y-5 border border-gray-100">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Name</label>
          <p className="font-medium text-text-primary">{user?.fullName}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Email</label>
          <p className="font-medium text-text-primary">{user?.email}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Role</label>
          <p className="font-medium text-text-primary capitalize">{user?.role}</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">Store ID</label>
          <p className="font-mono text-xs text-text-secondary bg-neutral rounded-lg px-3 py-2 break-all">{storeId}</p>
        </div>
      </div>
    </div>
  );
}
