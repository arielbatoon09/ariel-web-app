import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

export let redis: Redis | null = null;

if (redisUrl) {
  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
    });

    redis.on("error", (err) => {
      console.warn("Redis connection error:", err.message);
    });
  } catch (err) {
    console.error("Failed to initialize Redis client:", err);
  }
} else {
  console.warn("REDIS_URL is not set in environment variables. Caching is disabled.");
}

export async function redisGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn(`Redis get error for key ${key}:`, err);
    return null;
  }
}

export async function redisSet<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    console.warn(`Redis set error for key ${key}:`, err);
  }
}

export async function redisDel(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (err) {
    console.warn(`Redis del error for key ${key}:`, err);
  }
}
