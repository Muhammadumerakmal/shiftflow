"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth-context";

const NAV_ITEMS = [
  { href: "/schedule", label: "Schedule", icon: "📅" },
  { href: "/swap-requests", label: "Swaps", icon: "🔄" },
  { href: "/time-off", label: "Time Off", icon: "🏖️" },
  { href: "/attendance", label: "Attendance", icon: "⏱️" },
  { href: "/staff", label: "Staff", icon: "👥" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-56 bg-surface border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="px-4 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
            style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
          >
            S
          </div>
          <span className="font-semibold text-text-primary">ShiftFlow</span>
        </Link>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "text-white shadow-[0_4px_12px_rgba(91,141,239,0.3)]"
                  : "text-text-secondary hover:bg-neutral hover:text-text-primary"
              }`}
              style={active ? { background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" } : {}}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold">
            {user?.fullName?.charAt(0) || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user?.fullName}</p>
            <p className="text-xs text-text-muted capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-xs text-text-secondary hover:text-danger transition mt-1"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
