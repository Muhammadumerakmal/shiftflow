"use client";

import { useState } from "react";
import { api } from "../../../lib/api";

export default function ClockInPage() {
  const [status, setStatus] = useState(null); // null = unknown, "clocked_in", "clocked_out"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  async function handleClockIn() {
    setError("");
    setLoading(true);
    try {
      await api.clockIn({});
      setStatus("clocked_in");
      setLastAction({ type: "in", time: new Date() });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleClockOut() {
    setError("");
    setLoading(true);
    try {
      await api.clockOut();
      setStatus("clocked_out");
      setLastAction({ type: "out", time: new Date() });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">⏱️</span>
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-1">Clock In / Out</h1>
        <p className="text-sm text-text-muted">Tap the button to record your attendance.</p>
      </div>

      {error && (
        <div className="bg-danger-bg text-danger text-sm rounded-xl px-4 py-2.5 mb-4 border border-danger/10 w-full max-w-xs text-center">
          {error}
        </div>
      )}

      {lastAction && (
        <div className="bg-success-bg text-success text-sm rounded-xl px-4 py-2.5 mb-4 border border-success/10 w-full max-w-xs text-center">
          Clocked {lastAction.type} at {lastAction.time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </div>
      )}

      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={handleClockIn}
          disabled={loading}
          className="flex-1 bg-success text-white text-sm font-semibold rounded-xl py-4 hover:opacity-90 transition disabled:opacity-60 shadow-[0_4px_14px_rgba(46,125,50,0.2)]"
        >
          {loading ? "..." : "Clock In"}
        </button>
        <button
          onClick={handleClockOut}
          disabled={loading}
          className="flex-1 bg-danger text-white text-sm font-semibold rounded-xl py-4 hover:opacity-90 transition disabled:opacity-60 shadow-[0_4px_14px_rgba(211,47,47,0.2)]"
        >
          {loading ? "..." : "Clock Out"}
        </button>
      </div>
    </div>
  );
}
