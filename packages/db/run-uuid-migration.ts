import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectionString = process.env.POSTGRES_URL!;
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function runMigration() {
  try {
    console.log("Starting UUID migration...");
    
    // Read the migration SQL
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, "drizzle/0001_uuid_migration_safe.sql"),
      "utf-8"
    );
    
    // Execute the migration
    await sql.unsafe(migrationSQL);
    
    console.log("UUID migration completed successfully!");
    
    // Also update the drizzle migrations table
    await sql`
      INSERT INTO drizzle.__drizzle_migrations (hash, created_at) 
      VALUES ('uuid_migration_safe', ${Date.now()})
    `;
    
    console.log("Migration recorded in drizzle migrations table");
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

runMigration().catch(console.error);