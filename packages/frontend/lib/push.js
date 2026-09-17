import { api } from "./api";

// Web Push is only available in secure contexts (https or localhost) with a
// Service Worker + PushManager. iOS only supports it for installed PWAs.
export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function pushPermission() {
  return typeof Notification !== "undefined" ? Notification.permission : "denied";
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

async function getRegistration() {
  const existing = await navigator.serviceWorker.getRegistration("/sw.js");
  return existing || navigator.serviceWorker.register("/sw.js");
}

/**
 * Ask for permission, subscribe this browser, and register the subscription
 * with the backend. Returns { ok, reason }.
 */
export async function enablePush() {
  if (!pushSupported()) return { ok: false, reason: "unsupported" };

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { ok: false, reason: "denied" };

  const reg = await getRegistration();
  await navigator.serviceWorker.ready;

  // Reuse an existing subscription if present, else create one.
  let subscription = await reg.pushManager.getSubscription();
  if (!subscription) {
    const { publicKey } = await api.getVapidPublicKey();
    if (!publicKey) return { ok: false, reason: "server-not-configured" };
    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  await api.subscribePush(subscription.toJSON());
  return { ok: true };
}

export async function disablePush() {
  if (!pushSupported()) return;
  const reg = await navigator.serviceWorker.getRegistration("/sw.js");
  const subscription = await reg?.pushManager.getSubscription();
  if (subscription) {
    await api.unsubscribePush(subscription.endpoint).catch(() => {});
    await subscription.unsubscribe().catch(() => {});
  }
}
