/**
 * Lightweight in-isolate rate limiter for Cloudflare Pages Functions.
 *
 * Cloudflare Workers isolates persist between requests at the same edge,
 * so a global Map provides effective burst protection against rapid-fire
 * abuse from the same IP. This won't catch distributed attacks across
 * many edge locations, but it handles the common case: a single bot
 * hammering an endpoint from one location.
 *
 * Limits are intentionally very generous — only obvious automated abuse
 * is blocked. Normal users (even heavy ones) should never hit these.
 */

interface RateBucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, RateBucket>();

// Cleanup stale entries every 5 minutes to prevent unbounded memory growth
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > windowMs * 2) {
      buckets.delete(key);
    }
  }
}

/**
 * Check if a request should be allowed.
 *
 * @param key      Unique identifier (typically IP + endpoint)
 * @param maxHits  Maximum requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns true if allowed, false if rate-limited
 */
export function isAllowed(key: string, maxHits: number, windowMs: number): boolean {
  const now = Date.now();
  cleanup(windowMs);

  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    // New window
    buckets.set(key, { count: 1, windowStart: now });
    return true;
  }

  bucket.count++;
  return bucket.count <= maxHits;
}

/**
 * Extract the client IP from a Cloudflare request.
 * Falls back to a generic key if headers are missing.
 */
export function getClientIP(request: Request): string {
  return request.headers.get('CF-Connecting-IP')
    || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim()
    || 'unknown';
}
