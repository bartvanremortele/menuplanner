#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "..", "products.db");
const db = new Database(dbPath);

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { days: 60, delete: false };
  for (const a of args) {
    if (a.startsWith("--days="))
      opts.days = parseInt(a.split("=")[1] || "60", 10);
    if (a === "--delete") opts.delete = true;
    if (a === "--deactivate") opts.delete = false;
  }
  // Env overrides
  if (process.env.CLEANUP_DAYS)
    opts.days = parseInt(process.env.CLEANUP_DAYS, 10);
  if (process.env.CLEANUP_MODE === "delete") opts.delete = true;
  return opts;
}

function main() {
  const { days, delete: doDelete } = parseArgs();
  const now = Date.now();
  const cutoff = new Date(now - days * 24 * 60 * 60 * 1000);

  const total = db.prepare("SELECT COUNT(*) as c FROM products").get().c;
  const stale = db
    .prepare(
      "SELECT COUNT(*) as c FROM products WHERE last_scraped IS NOT NULL AND last_scraped < ?",
    )
    .get(cutoff.getTime()).c;

  console.log(`DB: ${dbPath}`);
  console.log(`Total products: ${total}`);
  console.log(`Stale (last_scraped < ${cutoff.toISOString()}): ${stale}`);

  if (stale === 0) return;

  if (doDelete) {
    const info = db
      .prepare(
        "DELETE FROM products WHERE last_scraped IS NOT NULL AND last_scraped < ?",
      )
      .run(cutoff.getTime());
    console.log(`Deleted rows: ${info.changes}`);
  } else {
    const info = db
      .prepare(
        "UPDATE products SET is_active = 0, updated_at = ?, in_stock = 0 WHERE last_scraped IS NOT NULL AND last_scraped < ?",
      )
      .run(Date.now(), cutoff.getTime());
    console.log(`Deactivated rows: ${info.changes}`);
  }
}

try {
  main();
} catch (e) {
  console.error("Cleanup failed:", e);
  process.exit(1);
}
