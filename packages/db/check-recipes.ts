import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { Recipe } from "./src/schema";

const connectionString = process.env.POSTGRES_URL!;
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

async function checkRecipes() {
  try {
    const recipes = await db
      .select({
        id: Recipe.id,
        name: Recipe.name,
      })
      .from(Recipe)
      .limit(10);

    console.log("Sample recipes with new UUIDs:");
    recipes.forEach((recipe) => {
      console.log(`- ${recipe.name}: ${recipe.id}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sql.end();
  }
}

checkRecipes().catch(console.error);
