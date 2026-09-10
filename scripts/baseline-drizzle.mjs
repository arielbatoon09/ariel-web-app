import "dotenv/config";
import postgres from "postgres";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "../drizzle/migrations");
const journal = JSON.parse(fs.readFileSync(path.join(migrationsDir, "meta/_journal.json"), "utf8"));

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

function hashMigration(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

try {
  await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await sql`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;

  const existing = await sql`SELECT hash FROM drizzle.__drizzle_migrations`;
  const existingHashes = new Set(existing.map((r) => r.hash));

  for (const entry of journal.entries) {
    const filePath = path.join(migrationsDir, `${entry.tag}.sql`);
    const content = fs.readFileSync(filePath, "utf8");
    const hash = hashMigration(content);

    if (existingHashes.has(hash)) {
      console.log(`skip (already recorded): ${entry.tag}`);
      continue;
    }

    await sql`
      INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
      VALUES (${hash}, ${entry.when})
    `;
    console.log(`baselined: ${entry.tag} → ${hash.slice(0, 12)}…`);
  }

  const rows = await sql`SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY id`;
  console.log("journal rows:", rows.length);
  for (const row of rows) {
    console.log(`  #${row.id} ${String(row.hash).slice(0, 12)}… ${row.created_at}`);
  }
} catch (e) {
  console.error("ERR", e);
  process.exitCode = 1;
} finally {
  await sql.end();
}
