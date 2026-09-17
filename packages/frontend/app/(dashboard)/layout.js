"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import Sidebar from "../../components/Sidebar";
import ChatWidget from "../../components/ChatWidget";
import EnablePushPrompt from "../../components/EnablePushPrompt";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user?.role === "staff") router.push("/my-schedule");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-text-secondary">Loading…</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-neutral min-h-screen">{children}</main>
      <ChatWidget />
      <EnablePushPrompt />
    </div>
  );
}

// redeploy 2026-09-16 00:26:02
