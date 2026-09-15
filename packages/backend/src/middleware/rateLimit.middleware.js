// Simple in-memory rate limiter (resets on cold start — fine for MVP)
const attempts = new Map();

export function rateLimit({ windowMs = 15 * 60 * 1000, max = 10 } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!attempts.has(key)) {
      attempts.set(key, []);
    }

    // Remove old attempts outside the window
    const timestamps = attempts.get(key).filter((t) => now - t < windowMs);
    attempts.set(key, timestamps);

    if (timestamps.length >= max) {
      return res.status(429).json({
        success: false,
        error: "Too many attempts. Please try again later.",
      });
    }

    timestamps.push(now);
    next();
  };
}
