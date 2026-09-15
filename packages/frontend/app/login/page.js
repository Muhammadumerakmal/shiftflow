"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";
import { api } from "../../lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("manager"); // "manager" or "staff"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleManagerLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      const role = result.user?.role;
      router.push(role === "staff" ? "/my-schedule" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.requestOtp(phone);
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await api.verifyOtp(phone, otp);
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("user", JSON.stringify(result.user));
      if (result.user.storeId) {
        localStorage.setItem("storeId", result.user.storeId);
      }
      const role = result.user?.role;
      window.location.href = role === "staff" ? "/my-schedule" : "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
            >
              S
            </div>
            <span className="text-xl font-semibold text-text-primary">ShiftFlow</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Welcome back</h1>
          <p className="text-sm text-text-secondary">
            Log in to manage your shifts and team.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-neutral rounded-xl p-1 mb-4">
          <button
            onClick={() => { setMode("manager"); setError(""); setOtpSent(false); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
              mode === "manager"
                ? "bg-surface shadow-sm text-text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Manager Login
          </button>
          <button
            onClick={() => { setMode("staff"); setError(""); setOtpSent(false); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
              mode === "staff"
                ? "bg-surface shadow-sm text-text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Staff Login
          </button>
        </div>

        <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-4">
          {error && (
            <div className="bg-danger-bg text-danger text-sm rounded-xl px-4 py-2.5 border border-danger/10">
              {error}
            </div>
          )}

          {mode === "manager" ? (
            <form onSubmit={handleManagerLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                  placeholder="you@store.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white text-sm font-semibold rounded-xl py-3 hover:opacity-90 transition disabled:opacity-60 shadow-[0_4px_14px_rgba(91,141,239,0.3)]"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          ) : !otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                  placeholder="+15551234567"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white text-sm font-semibold rounded-xl py-3 hover:opacity-90 transition disabled:opacity-60 shadow-[0_4px_14px_rgba(91,141,239,0.3)]"
              >
                {loading ? "Sending..." : "Send OTP Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-text-secondary text-center">
                Code sent to <span className="font-medium text-text-primary">{phone}</span>
              </p>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Enter 6-Digit Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-center tracking-[0.3em] font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                  placeholder="000000"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white text-sm font-semibold rounded-xl py-3 hover:opacity-90 transition disabled:opacity-60 shadow-[0_4px_14px_rgba(91,141,239,0.3)]"
              >
                {loading ? "Verifying..." : "Verify & Log In"}
              </button>
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(""); }}
                className="w-full text-sm text-text-muted hover:text-text-secondary transition"
              >
                Use a different number
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-text-secondary mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-accent hover:text-accent-light transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
