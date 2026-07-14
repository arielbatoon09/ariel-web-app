import { redis } from "./redis";
import { headers } from "next/headers";

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Checks if a request exceeds a rate limit.
 * @param key The unique key prefix (e.g., 'rate_limit:login')
 * @param limit Max requests allowed in the window
 * @param windowSeconds Duration of the window in seconds
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (!redis) {
    // If Redis is not initialized, fail-open to not block users
    console.warn(`[Rate Limit] Redis not initialized. Skipping rate limit check for ${key}.`);
    return { success: true, limit, remaining: limit, reset: 0 };
  }

  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const redisKey = `${key}:${ip}`;

    const current = await redis.get(redisKey);
    const currentCount = current ? parseInt(current, 10) : 0;

    if (currentCount >= limit) {
      const ttl = await redis.ttl(redisKey);
      return {
        success: false,
        limit,
        remaining: 0,
        reset: ttl > 0 ? ttl : windowSeconds,
      };
    }

    const pipeline = redis.pipeline();
    pipeline.incr(redisKey);
    if (!current) {
      pipeline.expire(redisKey, windowSeconds);
    }
    await pipeline.exec();

    return {
      success: true,
      limit,
      remaining: limit - (currentCount + 1),
      reset: windowSeconds,
    };
  } catch (err) {
    console.error(`[Rate Limit] Error checking rate limit for ${key}:`, err);
    // Fail-open on error
    return { success: true, limit, remaining: limit, reset: 0 };
  }
}
