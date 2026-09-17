"use client";

// Prompts the user to turn on browser/mobile push notifications, and keeps the
// backend subscription in sync when permission is already granted. Renders a
// small dismissible banner only when it can actually do something.

import { useEffect, useState } from "react";
import { enablePush, pushSupported, pushPermission } from "../lib/push";

export default function EnablePushPrompt() {
  const [state, setState] = useState("hidden"); // hidden | prompt | working | error
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!pushSupported()) return;
    const perm = pushPermission();
    if (perm === "granted") {
      // Already allowed — silently (re)register this device with the backend.
      enablePush().catch(() => {});
    } else if (perm === "default") {
      setState("prompt");
    }
  }, []);

  if (state === "hidden" || dismissed) return null;

  async function handleEnable() {
    setState("working");
    const res = await enablePush();
    if (res.ok) {
      setDismissed(true);
    } else {
      setState(res.reason === "denied" ? "hidden" : "error");
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-xs bg-surface border border-gray-200 rounded-2xl shadow-lg p-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl">🔔</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary">Turn on notifications</p>
          <p className="text-xs text-text-secondary mt-0.5">
            Get alerts on this device for sign-ins, shift updates, and swap requests.
          </p>
          {state === "error" && (
            <p className="text-xs text-danger mt-1">Couldn&apos;t enable notifications. Try again.</p>
          )}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEnable}
              disabled={state === "working"}
              className="text-xs font-medium bg-primary text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              {state === "working" ? "Enabling…" : "Enable"}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-xs font-medium text-text-secondary px-3 py-1.5 rounded-lg hover:bg-neutral"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
