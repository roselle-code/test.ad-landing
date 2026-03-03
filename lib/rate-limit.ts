// In-memory sliding-window rate limiter. State resets on serverless cold start.
// On Vercel, each function instance has its own Map, so limits are per-instance.
// For strict global rate limiting, consider @upstash/ratelimit with Redis.

const hits = new Map<string, number[]>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  const cutoff = now - windowMs;
  for (const [key, timestamps] of hits) {
    const valid = timestamps.filter((t) => t > cutoff);
    if (valid.length === 0) hits.delete(key);
    else hits.set(key, valid);
  }
}

export function rateLimit(
  ip: string,
  { maxRequests = 5, windowMs = 60_000 } = {}
): { allowed: boolean; remaining: number } {
  cleanup(windowMs);

  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = (hits.get(ip) || []).filter((t) => t > cutoff);

  if (timestamps.length >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(ip, timestamps);
  return { allowed: true, remaining: maxRequests - timestamps.length };
}
