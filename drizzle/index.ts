import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in env variables");
}

type PgClient = ReturnType<typeof postgres>;

const globalForDb = globalThis as unknown as {
  pgClient: PgClient | undefined;
};

/**
 * Reuse one client across Next.js HMR reloads in dev.
 * Transaction pooler (port 6543): keep max low + prepare: false.
 */
export const client =
  globalForDb.pgClient ??
  postgres(connectionString, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgClient = client;
}

export const db = drizzle(client, { schema });
