"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";
import EnablePushPrompt from "../../components/EnablePushPrompt";

const TABS = [
  { href: "/my-schedule", label: "Schedule", icon: "📅" },
  { href: "/clock-in", label: "Clock In", icon: "⏱️" },
  { href: "/my-requests", label: "Requests", icon: "📋" },
];

export default function StaffLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-text-secondary">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-neutral pb-20">
      <header className="sticky top-0 z-40 bg-surface border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
            style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
          >
            S
          </div>
          <span className="font-semibold text-text-primary">ShiftFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold">
            {user?.fullName?.charAt(0) || "?"}
          </div>
        </div>
      </header>

      <main className="p-4">{children}</main>

      <EnablePushPrompt />

      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-100 flex z-50">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition ${
                active ? "text-accent" : "text-text-muted"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
