"use client";

// Settings control to turn push notifications on/off for this device.
// Reflects the live browser permission + subscription state.

import { useEffect, useState } from "react";
import { enablePush, disablePush, pushSupported, pushPermission } from "../lib/push";

export default function NotificationsToggle() {
  const [supported, setSupported] = useState(true);
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pushSupported()) {
      setSupported(false);
      return;
    }
    // Considered "on" only when permission is granted AND a subscription exists.
    (async () => {
      if (pushPermission() !== "granted") return setOn(false);
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      const sub = await reg?.pushManager.getSubscription();
      setOn(Boolean(sub));
    })();
  }, []);

  async function toggle() {
    setBusy(true);
    setError("");
    try {
      if (on) {
        await disablePush();
        setOn(false);
      } else {
        const res = await enablePush();
        if (res.ok) {
          setOn(true);
        } else {
          setError(
            res.reason === "denied"
              ? "Notifications are blocked. Enable them in your browser's site settings."
              : "Couldn't enable notifications. Please try again."
          );
        }
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="pr-4">
        <label className="block text-sm font-medium text-text-primary">Push notifications</label>
        <p className="text-xs text-text-muted mt-0.5">
          {supported
            ? "Get alerts on this device for sign-ins, shifts, and swap requests."
            : "This browser doesn't support push notifications. On iPhone, add the app to your Home Screen first."}
        </p>
        {error && <p className="text-xs text-danger mt-1">{error}</p>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={toggle}
        disabled={!supported || busy}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
          on ? "bg-primary" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
