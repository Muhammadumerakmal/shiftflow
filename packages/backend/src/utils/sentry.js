import * as Sentry from "@sentry/node";
import { env } from "../config/env.js";

export function initSentry() {
  if (!env.sentryDsn) {
    return;
  }

  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.nodeEnv,
    tracesSampleRate: 0.1,
    enableLogs: true,
  });
}

export function captureError(err, context = {}) {
  if (!env.sentryDsn) {
    return;
  }
  Sentry.captureException(err, { extra: context });
}

export function addSentryContext(context) {
  if (!env.sentryDsn) {
    return;
  }
  Sentry.setContext("request", context);
}