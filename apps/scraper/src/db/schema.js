import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand"),
  category: text("category"),
  subcategory: text("subcategory"),
  price: real("price"),
  pricePerUnit: text("price_per_unit"),
  imageUrl: text("image_url"),
  productUrl: text("product_url"),
  description: text("description"),
  barcode: text("barcode"),
  ean: text("ean"),
  inStock: integer("in_stock", { mode: "boolean" }).default(true),
  // Whether the product is considered active in the catalog.
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  nutritionFacts: text("nutrition_facts", { mode: "json" }),
  allergens: text("allergens", { mode: "json" }),
  ingredients: text("ingredients"),
  weight: text("weight"),
  lastScraped: integer("last_scraped", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const scrapeHistory = sqliteTable("scrape_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  startedAt: integer("started_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  productsFound: integer("products_found").default(0),
  productsUpdated: integer("products_updated").default(0),
  productsNew: integer("products_new").default(0),
  errors: text("errors", { mode: "json" }),
  status: text("status").default("running"),
  categories: text("categories", { mode: "json" }),
});
