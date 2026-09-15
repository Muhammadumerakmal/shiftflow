"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.push(user ? "/schedule" : "/login");
  }, [user, loading, router]);

  return <div className="min-h-screen flex items-center justify-center text-text-secondary">Loading…</div>;
}
