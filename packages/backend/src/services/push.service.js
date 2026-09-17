import webpush from "web-push";
import { env } from "../config/env.js";
import { PushSubscriptionModel } from "../models/pushSubscription.model.js";

let configured = false;

// Configure web-push lazily so a missing VAPID key degrades gracefully
// (push is skipped) instead of crashing the whole app at import time.
function ensureConfigured() {
  if (configured) return true;
  if (!env.vapid.publicKey || !env.vapid.privateKey) return false;
  webpush.setVapidDetails(
    env.vapid.subject,
    env.vapid.publicKey,
    env.vapid.privateKey
  );
  configured = true;
  return true;
}

export const PushService = {
  isEnabled() {
    return Boolean(env.vapid.publicKey && env.vapid.privateKey);
  },

  /**
   * Save (or refresh) a browser's push subscription for a user.
   * `subscription` is the object returned by PushManager.subscribe() on the client.
   */
  async subscribe({ userId, subscription, userAgent }) {
    if (!subscription?.endpoint || !subscription?.keys) {
      const err = new Error("Invalid push subscription payload.");
      err.status = 400;
      throw err;
    }
    return PushSubscriptionModel.upsert({
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userAgent,
    });
  },

  async unsubscribe(endpoint) {
    if (endpoint) await PushSubscriptionModel.deleteByEndpoint(endpoint);
  },

  /**
   * Send a Web Push notification to every device registered for a user.
   * Never throws — push is best-effort; failures are logged, and expired
   * subscriptions (404/410) are pruned automatically.
   */
  async sendToUser(userId, { title, body, url }) {
    if (!ensureConfigured()) return { sent: 0, skipped: true };

    const subs = await PushSubscriptionModel.findByUser(userId);
    if (!subs.length) return { sent: 0 };

    const payload = JSON.stringify({ title, body, url: url || "/" });
    let sent = 0;

    await Promise.all(
      subs.map(async (s) => {
        const subscription = {
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth },
        };
        try {
          await webpush.sendNotification(subscription, payload);
          sent += 1;
        } catch (err) {
          // 404/410 => subscription no longer valid; remove it.
          if (err.statusCode === 404 || err.statusCode === 410) {
            await PushSubscriptionModel.deleteByEndpoint(s.endpoint);
          } else {
            console.error("[push] send failed:", err.statusCode, err.body || err.message);
          }
        }
      })
    );

    return { sent };
  },
};
