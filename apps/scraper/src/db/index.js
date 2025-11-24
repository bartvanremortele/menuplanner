import Database from "better-sqlite3";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema.js";

const sqlite = new Database("./products.db");
export const db = drizzle(sqlite, { schema });

export class ProductDatabase {
  async upsertProduct(product) {
    const existingProduct = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, product.id))
      .get();

    if (existingProduct) {
      await db
        .update(schema.products)
        .set({
          ...product,
          updatedAt: new Date(),
          lastScraped: new Date(),
          isActive: true,
        })
        .where(eq(schema.products.id, product.id))
        .run();
      return "updated";
    } else {
      await db
        .insert(schema.products)
        .values({
          ...product,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastScraped: new Date(),
          isActive: true,
        })
        .run();
      return "created";
    }
  }

  async startScrapeSession() {
    const result = await db
      .insert(schema.scrapeHistory)
      .values({
        startedAt: new Date(),
        status: "running",
      })
      .returning({ id: schema.scrapeHistory.id })
      .get();
    return result.id;
  }

  async updateScrapeSession(sessionId, updates) {
    await db
      .update(schema.scrapeHistory)
      .set(updates)
      .where(eq(schema.scrapeHistory.id, sessionId))
      .run();
  }

  async getProductStats() {
    const result = await db
      .select({
        totalProducts: sql`COUNT(*)`,
        totalCategories: sql`COUNT(DISTINCT ${schema.products.category})`,
        avgPrice: sql`AVG(${schema.products.price})`,
        lastUpdate: sql`MAX(${schema.products.lastScraped})`,
      })
      .from(schema.products)
      .where(eq(schema.products.isActive, true))
      .get();

    return result;
  }

  async searchProducts(query, limit = 50) {
    return await db
      .select()
      .from(schema.products)
      .where(
        and(
          eq(schema.products.isActive, true),
          or(
            like(schema.products.name, `%${query}%`),
            like(schema.products.brand, `%${query}%`),
            like(schema.products.category, `%${query}%`),
          ),
        ),
      )
      .limit(limit)
      .all();
  }

  async getCategories() {
    const result = await db
      .selectDistinct({ category: schema.products.category })
      .from(schema.products)
      .where(
        sql`${schema.products.category} IS NOT NULL AND ${schema.products.isActive} = 1`,
      )
      .all();

    return result.map((r) => r.category);
  }

  async getRecentScrapes(limit = 10) {
    return await db
      .select()
      .from(schema.scrapeHistory)
      .orderBy(desc(schema.scrapeHistory.startedAt))
      .limit(limit)
      .all();
  }
}
