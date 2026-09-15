"use client";

import { useAuth } from "../../../lib/auth-context";

export default function SettingsPage() {
  const { user, storeId } = useAuth();

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary">Account and store information.</p>
      </div>

      <div className="bg-surface rounded-xl shadow-sm p-5 max-w-md space-y-3 text-sm">
        <div>
          <span className="text-text-secondary">Name</span>
          <p className="font-medium text-text-primary">{user?.fullName}</p>
        </div>
        <div>
          <span className="text-text-secondary">Email</span>
          <p className="font-medium text-text-primary">{user?.email}</p>
        </div>
        <div>
          <span className="text-text-secondary">Role</span>
          <p className="font-medium text-text-primary capitalize">{user?.role}</p>
        </div>
        <div>
          <span className="text-text-secondary">Store ID</span>
          <p className="font-mono text-xs text-text-primary break-all">{storeId}</p>
        </div>
      </div>
    </div>
  );
}
