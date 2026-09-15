"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import LandingPage from "../components/LandingPage";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) router.push("/schedule");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        Redirecting to dashboard...
      </div>
    );
  }

  return <LandingPage />;
}
