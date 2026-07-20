/**
 * Migration runner for backend/migrations/
 *
 * Tracks applied migrations in a _migrations table.
 * Usage: node --import tsx migrations/migrate.js
 *    or: pnpm migrate
 */

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../jobs.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Ensure migration tracking table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS _migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const applied = new Set(
  db
    .prepare("SELECT name FROM _migrations")
    .all()
    .map((r) => r.name)
);

const migrationFiles = fs
  .readdirSync(__dirname)
  .filter((f) => /^\d{3}_.*\.sql$/.test(f))
  .sort();

let applied_count = 0;

for (const file of migrationFiles) {
  if (applied.has(file)) {
    continue;
  }

  const sql = fs.readFileSync(path.join(__dirname, file), "utf-8");
  console.log(`⏳ Applying: ${file}`);

  try {
    db.exec(sql);
    db.prepare("INSERT INTO _migrations (name) VALUES (?)").run(file);
    console.log(`✅ Done: ${file}`);
    applied_count++;
  } catch (err) {
    console.error(`❌ Failed: ${file}`);
    console.error(err.message);
    process.exit(1);
  }
}

if (applied_count === 0) {
  console.log("ℹ️  No new migrations to apply.");
} else {
  console.log(`\n🎉 Applied ${applied_count} migration(s).`);
}

db.close();
