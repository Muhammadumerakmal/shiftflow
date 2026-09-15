"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth-context";

const NAV_ITEMS = [
  { href: "/schedule", label: "Schedule", icon: "📅" },
  { href: "/swap-requests", label: "Swap Requests", icon: "🔄" },
  { href: "/time-off", label: "Time Off", icon: "🏖️" },
  { href: "/attendance", label: "Attendance", icon: "⏱️" },
  { href: "/staff", label: "Staff", icon: "👥" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 bg-surface border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-sm flex items-center justify-center">
          S
        </div>
        <span className="font-semibold text-text-primary">ShiftFlow</span>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-neutral hover:text-text-primary"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-sm font-medium text-text-primary truncate">{user?.fullName}</p>
        <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
        <button
          onClick={logout}
          className="mt-2 text-xs text-danger hover:underline"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
