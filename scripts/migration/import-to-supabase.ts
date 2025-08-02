import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { sql } from "drizzle-orm";
import { config } from "dotenv";

// Load environment variables from .env file
config({ path: path.join(__dirname, "../../.env") });

import { db } from "../../packages/db/src/client";
import {
  DayPlan,
  Ingredient,
  Label,
  Recipe,
  RecipeIngredient,
  RecipeLabelConnection,
  Unit,
  WeekDayConfig,
} from "../../packages/db/src/schema";

const TRANSFORMED_DIR = path.join(__dirname, "transformed");

// Helper function to read CSV file
function readCSV(filename: string): any[] {
  const filePath = path.join(TRANSFORMED_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filename} not found, skipping...`);
    return [];
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return parse(fileContent, { columns: true, skip_empty_lines: true });
}

async function importUnits() {
  console.log("Importing units...");
  const units = readCSV("unit.csv");

  if (units.length === 0) return;

  // Insert units one by one to handle duplicates
  for (const unit of units) {
    try {
      await db
        .insert(Unit)
        .values({
          abbr: unit.abbr,
          name: unit.name,
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error(`Failed to insert unit ${unit.abbr}:`, error);
    }
  }

  console.log(`✓ Imported ${units.length} units`);
}

async function importIngredients() {
  console.log("Importing ingredients...");
  const ingredients = readCSV("ingredient.csv");

  if (ingredients.length === 0) return;

  // Helper to convert empty strings to null
  const toNull = (value: string) => (value === "" ? null : value);
  const toNumberOrNull = (value: string) => {
    if (value === "" || value === null || value === undefined) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  // We need to handle the ID sequence properly
  // First, insert all ingredients
  for (const ing of ingredients) {
    try {
      await db.execute(sql`
        INSERT INTO ingredient (
          id, name, url, kj, kcal, water, eiwit, koolhydraten, 
          suikers, vet, verzadigd_vet, enkelvoudig_onverzadigd_vet,
          meervoudig_onverzadigd_vet, cholesterol, voedingsvezel, 
          gevoel, gezondheid
        ) 
        OVERRIDING SYSTEM VALUE
        VALUES (
          ${ing.id}, ${ing.name}, ${toNull(ing.url)}, ${toNumberOrNull(ing.kj)}, ${toNumberOrNull(ing.kcal)}, 
          ${toNumberOrNull(ing.water)}, ${toNumberOrNull(ing.eiwit)}, ${toNumberOrNull(ing.koolhydraten)}, ${toNumberOrNull(ing.suikers)}, 
          ${toNumberOrNull(ing.vet)}, ${toNumberOrNull(ing.verzadigdVet)}, ${toNumberOrNull(ing.enkelvoudigOnverzadigdVet)},
          ${toNumberOrNull(ing.meervoudigOnverzadigdVet)}, ${toNumberOrNull(ing.cholesterol)}, 
          ${toNumberOrNull(ing.voedingsvezel)}, ${toNumberOrNull(ing.gevoel)}, ${toNumberOrNull(ing.gezondheid)}
        )
        ON CONFLICT (id) DO NOTHING
      `);
    } catch (error) {
      console.error(`Failed to insert ingredient ${ing.id}:`, error);
    }
  }

  // Update the sequence
  const maxId = Math.max(...ingredients.map((i) => parseInt(i.id)));
  await db.execute(sql`
    SELECT setval('ingredient_id_seq', ${maxId}, true)
  `);

  console.log(`✓ Imported ${ingredients.length} ingredients`);
}

async function importLabels() {
  console.log("Importing labels...");
  const labels = readCSV("label.csv");

  if (labels.length === 0) return;

  // Insert labels with their IDs
  for (const label of labels) {
    try {
      await db.execute(sql`
        INSERT INTO label (id, name, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES (${label.id}, ${label.name}, ${label.createdAt}::timestamp, ${label.updatedAt}::timestamp)
        ON CONFLICT (id) DO NOTHING
      `);
    } catch (error) {
      console.error(`Failed to insert label ${label.id}:`, error);
    }
  }

  // Update the sequence
  const maxId = Math.max(...labels.map((l) => parseInt(l.id)));
  await db.execute(sql`
    SELECT setval('label_id_seq', ${maxId}, true)
  `);

  console.log(`✓ Imported ${labels.length} labels`);
}

async function importRecipes() {
  console.log("Importing recipes...");
  const recipes = readCSV("recipe.csv");

  if (recipes.length === 0) return;

  // Insert recipes with their IDs
  for (const recipe of recipes) {
    try {
      await db.execute(sql`
        INSERT INTO recipe (
          id, name, description, image_key, created_by_user_id, 
          created_at, updated_at
        )
        OVERRIDING SYSTEM VALUE
        VALUES (
          ${recipe.id}, ${recipe.name}, ${recipe.description}, 
          ${recipe.imageKey}, ${recipe.createdByUserId}, 
          ${recipe.createdAt}::timestamp, ${recipe.updatedAt}::timestamp
        )
        ON CONFLICT (id) DO NOTHING
      `);
    } catch (error) {
      console.error(`Failed to insert recipe ${recipe.id}:`, error);
    }
  }

  // Update the sequence
  const maxId = Math.max(...recipes.map((r) => parseInt(r.id)));
  await db.execute(sql`
    SELECT setval('recipe_id_seq', ${maxId}, true)
  `);

  console.log(`✓ Imported ${recipes.length} recipes`);
}

async function importRecipeLabelConnections() {
  console.log("Importing recipe-label connections...");
  const connections = readCSV("recipe_label_connection.csv");

  if (connections.length === 0) return;

  for (const conn of connections) {
    try {
      await db
        .insert(RecipeLabelConnection)
        .values({
          recipeId: parseInt(conn.recipeId),
          labelId: parseInt(conn.labelId),
          assignedAt: new Date(conn.assignedAt),
          assignedByUserId: conn.assignedByUserId,
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error(`Failed to insert connection:`, error);
    }
  }

  console.log(`✓ Imported ${connections.length} recipe-label connections`);
}

async function importRecipeIngredients() {
  console.log("Importing recipe ingredients...");
  const ingredients = readCSV("recipe_ingredient.csv");

  if (ingredients.length === 0) return;

  // Helper to convert empty strings to null for numbers
  const toNumberOrNull = (value: string) => {
    if (value === "" || value === null || value === undefined) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  for (const ing of ingredients) {
    try {
      const amount = toNumberOrNull(ing.amount);
      if (amount === null) {
        console.warn(`Skipping recipe ingredient with null amount: recipe ${ing.recipeId}, ingredient ${ing.ingredientId}`);
        continue;
      }
      
      await db
        .insert(RecipeIngredient)
        .values({
          recipeId: parseInt(ing.recipeId),
          ingredientId: parseInt(ing.ingredientId),
          amount: amount,
          unitAbbr: ing.unitAbbr,
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error(`Failed to insert recipe ingredient:`, error);
    }
  }

  console.log(`✓ Imported ${ingredients.length} recipe ingredients`);
}

async function importWeekDayConfigs() {
  console.log("Importing week day configs...");
  const configs = readCSV("week_day_config.csv");

  if (configs.length === 0) return;

  for (const config of configs) {
    try {
      await db
        .insert(WeekDayConfig)
        .values({
          weekDay: parseInt(config.weekDay),
          labelId: parseInt(config.labelId),
          userId: config.userId,
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error(`Failed to insert week day config:`, error);
    }
  }

  console.log(`✓ Imported ${configs.length} week day configs`);
}

async function importDayPlans() {
  console.log("Importing day plans...");
  const plans = readCSV("day_plan.csv");

  if (plans.length === 0) return;

  for (const plan of plans) {
    try {
      await db
        .insert(DayPlan)
        .values({
          day: new Date(plan.day),
          recipeId: parseInt(plan.recipeId),
          userId: plan.userId,
          labelId: plan.labelId ? parseInt(plan.labelId) : null,
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error(`Failed to insert day plan:`, error);
    }
  }

  console.log(`✓ Imported ${plans.length} day plans`);
}

// Main execution
async function main() {
  console.log("Starting Supabase import...");
  console.log("");

  try {
    // Import in correct order to respect foreign key constraints
    await importUnits();
    await importIngredients();
    await importLabels();
    await importRecipes();
    await importRecipeLabelConnections();
    await importRecipeIngredients();
    await importWeekDayConfigs();
    await importDayPlans();

    console.log("\n✅ Import completed successfully!");
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  }
}

main();
