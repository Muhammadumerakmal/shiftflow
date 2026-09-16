// Simple in-memory cache with TTL support
const cache = new Map();

export function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

export function cacheSet(key, value, ttlMs) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export function cacheDelete(key) {
  cache.delete(key);
}

export function cacheInvalidatePrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

export function cacheClear() {
  cache.clear();
}