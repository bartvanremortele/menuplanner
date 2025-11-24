#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "..", "products.db");
const db = new Database(dbPath, { readonly: true });

function showSummary() {
  const total = db.prepare("SELECT COUNT(*) as c FROM products").get().c;
  const byCategory = db
    .prepare(
      `SELECT COALESCE(NULLIF(TRIM(category), ''), '(null)') as category, COUNT(*) as count
       FROM products
       GROUP BY category
       ORDER BY count DESC
       LIMIT 25`,
    )
    .all();

  console.log(`DB: ${dbPath}`);
  console.log(`Total products: ${total}`);
  console.log("\nTop categories:");
  for (const row of byCategory) {
    console.log(`- ${row.category}: ${row.count}`);
  }

  const sample = db
    .prepare(
      `SELECT id, name, brand, category, subcategory, price, product_url as productUrl
       FROM products
       ORDER BY updated_at DESC
       LIMIT 5`,
    )
    .all();
  console.log("\nSample products:");
  for (const p of sample) {
    console.log(
      `- [${p.category ?? "(null)"}] ${p.name} (${p.brand ?? "—"}) €${p.price ?? "—"}`,
    );
  }
}

try {
  showSummary();
} catch (e) {
  console.error("Failed to inspect DB:", e);
  process.exit(1);
}
