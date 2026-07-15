import { redis } from "./redis";
import { headers } from "next/headers";

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Checks if a request exceeds a rate limit using a sliding window log in Redis.
 * Supports checking both Client IP and an optional custom Identifier (e.g. email).
 *
 * @param key Unique key prefix (e.g. 'rate_limit:login')
 * @param limit Max requests allowed in the window
 * @param windowSeconds Duration of the window in seconds
 * @param identifier Optional identifier to throttle (e.g. email address)
 */
export async function checkRateLimit(key: string, limit: number, windowSeconds: number, identifier?: string): Promise<RateLimitResult> {
  if (!redis) {
    // Fail-open if Redis is down
    console.warn(`[Rate Limit] Redis not initialized. Skipping rate limit check for ${key}.`);
    return { success: true, limit, remaining: limit, reset: 0 };
  }

  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    // 1. Check IP limit
    const ipKey = `${key}:ip:${ip}`;
    const ipResult = await checkSlidingWindow(ipKey, limit, windowSeconds);
    if (!ipResult.success) {
      return ipResult;
    }

    // 2. Check Identifier limit (if provided)
    if (identifier) {
      // Normalize identifier (e.g. lowercase email) to prevent bypasses via casing
      const normalizedId = identifier.trim().toLowerCase();
      const idKey = `${key}:id:${normalizedId}`;
      const idResult = await checkSlidingWindow(idKey, limit, windowSeconds);
      if (!idResult.success) {
        return idResult;
      }

      // Return the more restrictive count
      return {
        success: true,
        limit,
        remaining: Math.min(ipResult.remaining, idResult.remaining),
        reset: Math.max(ipResult.reset, idResult.reset),
      };
    }

    return ipResult;
  } catch (err) {
    console.error(`[Rate Limit] Error checking rate limit for ${key}:`, err);
    return { success: true, limit, remaining: limit, reset: 0 };
  }
}

/**
 * Helper to execute a sliding window log check on a specific Redis key.
 */
async function checkSlidingWindow(redisKey: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  if (!redis) {
    return { success: true, limit, remaining: limit, reset: 0 };
  }

  const now = Date.now();
  const clearBefore = now - windowSeconds * 1000;
  const member = `${now}-${Math.random()}`; // Unique member to allow multiple hits at same millisecond

  const pipeline = redis.pipeline();
  // Clear members outside the sliding window
  pipeline.zremrangebyscore(redisKey, 0, clearBefore);
  // Add new request timestamp log
  pipeline.zadd(redisKey, now, member);
  // Retrieve current active logs count
  pipeline.zcard(redisKey);
  // Re-establish TTL on key to auto-clean logs when inactive
  pipeline.expire(redisKey, windowSeconds);

  const results = await pipeline.exec();
  if (!results) {
    return { success: true, limit, remaining: limit, reset: 0 };
  }

  // results[2] corresponds to the zcard operation
  const zcardResult = results[2];
  const currentCount = zcardResult && zcardResult[1] ? (zcardResult[1] as number) : 0;

  if (currentCount > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: windowSeconds,
    };
  }

  return {
    success: true,
    limit,
    remaining: limit - currentCount,
    reset: windowSeconds,
  };
}
