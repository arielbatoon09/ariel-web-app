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

const isDev = process.env.NODE_ENV !== "production";

/**
 * Dev: max 1 + global singleton avoids HMR connection leaks (EMAXCONN).
 * Prod/build: small pool + connect_timeout so SSG cannot hang for 60s+.
 * Transaction pooler (6543): prepare must stay false.
 */
export const client =
  globalForDb.pgClient ??
  postgres(connectionString, {
    prepare: false,
    max: isDev ? 1 : 5,
    connect_timeout: 10,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
  });

if (isDev) {
  globalForDb.pgClient = client;
}

export const db = drizzle(client, { schema });
