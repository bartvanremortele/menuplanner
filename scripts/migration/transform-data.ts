import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import fs from "fs";
import path from "path";

// New Supabase user ID to replace all old user references
const NEW_USER_ID = "zQQ2136sKAeML90RHmB9hLM6Vin8tbpm";

// Note: The old schema uses integer user IDs, but new schema uses text IDs
// We'll need to handle this in the transformation

// Data directory
const DATA_DIR = path.join(__dirname, "data");
const OUTPUT_DIR = path.join(__dirname, "transformed");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper function to read CSV file
function readCSV(filename: string): any[] {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File ${filename} not found, skipping...`);
    return [];
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return parse(fileContent, { columns: true, skip_empty_lines: true });
}

// Helper function to write CSV file
function writeCSV(filename: string, data: any[]) {
  if (data.length === 0) return;
  const output = stringify(data, { header: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), output);
}

// Transform functions for each table
function transformRecipes() {
  console.log("Transforming recipes...");
  const recipes = readCSV("recipe.csv");
  
  const transformed = recipes.map(recipe => ({
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    imageKey: recipe.image_key || null,
    createdByUserId: NEW_USER_ID, // Replace with new user ID
    createdAt: recipe.createdAt || new Date().toISOString(),
    updatedAt: recipe.updatedAt || new Date().toISOString(),
  }));
  
  writeCSV("recipe.csv", transformed);
  console.log(`✓ Transformed ${transformed.length} recipes`);
}

function transformLabels() {
  console.log("Transforming labels...");
  const labels = readCSV("label.csv");
  
  const transformed = labels.map(label => ({
    id: label.id,
    name: label.name,
    createdAt: label.createdAt || new Date().toISOString(),
    updatedAt: label.updatedAt || new Date().toISOString(),
  }));
  
  writeCSV("label.csv", transformed);
  console.log(`✓ Transformed ${transformed.length} labels`);
}

function transformRecipeLabelConnections() {
  console.log("Transforming recipe-label connections...");
  const connections = readCSV("recipelabelconnection.csv");
  
  const transformed = connections.map(conn => ({
    recipeId: conn.recipeId,
    labelId: conn.labelId,
    assignedAt: conn.assignedAt || new Date().toISOString(),
    assignedByUserId: NEW_USER_ID, // Replace with new user ID
  }));
  
  writeCSV("recipe_label_connection.csv", transformed);
  console.log(`✓ Transformed ${transformed.length} recipe-label connections`);
}

function transformWeekDayConfig() {
  console.log("Transforming week day configs...");
  const configs = readCSV("weekdayconfig.csv");
  
  const transformed = configs.map(config => ({
    weekDay: config.weekDay,
    labelId: config.labelId,
    userId: NEW_USER_ID, // Replace with new user ID
  }));
  
  writeCSV("week_day_config.csv", transformed);
  console.log(`✓ Transformed ${transformed.length} week day configs`);
}

function transformDayPlans() {
  console.log("Transforming day plans...");
  const plans = readCSV("dayplan.csv");
  
  const transformed = plans.map(plan => ({
    day: plan.day,
    recipeId: plan.recipeId,
    userId: NEW_USER_ID, // Replace with new user ID
    labelId: plan.labelId || null,
  }));
  
  writeCSV("day_plan.csv", transformed);
  console.log(`✓ Transformed ${transformed.length} day plans`);
}

function transformIngredients() {
  console.log("Transforming ingredients...");
  const ingredients = readCSV("ingredient.csv");
  
  // Helper to convert empty strings or invalid values to null for numeric fields
  const toNumber = (value: any) => {
    if (value === null || value === undefined || value === '') return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };
  
  const transformed = ingredients.map(ing => ({
    id: ing.id,
    name: ing.name,
    url: ing.url || null,
    kj: toNumber(ing.kj),
    kcal: toNumber(ing.kcal),
    water: toNumber(ing.water),
    eiwit: toNumber(ing.eiwit),
    koolhydraten: toNumber(ing.koolhydraten),
    suikers: toNumber(ing.suikers),
    vet: toNumber(ing.vet),
    verzadigdVet: toNumber(ing.verzadigd_vet),
    enkelvoudigOnverzadigdVet: toNumber(ing.enkelvoudig_onverzadigd_vet),
    meervoudigOnverzadigdVet: toNumber(ing.meervoudig_onverzadigd_vet),
    cholesterol: toNumber(ing.cholesterol),
    voedingsvezel: toNumber(ing.voedingsvezel),
    gevoel: toNumber(ing.gevoel),
    gezondheid: toNumber(ing.gezondheid),
  }));
  
  writeCSV("ingredient.csv", transformed);
  console.log(`✓ Transformed ${transformed.length} ingredients`);
}

function transformUnits() {
  console.log("Transforming units...");
  const units = readCSV("unit.csv");
  
  const transformed = units.map(unit => ({
    abbr: unit.abbr,
    name: unit.name,
  }));
  
  writeCSV("unit.csv", transformed);
  console.log(`✓ Transformed ${transformed.length} units`);
}

function transformRecipeIngredients() {
  console.log("Transforming recipe ingredients...");
  const ingredients = readCSV("recipeingredient.csv");
  
  // Helper to convert empty strings or invalid values to null for numeric fields
  const toNumber = (value: any) => {
    if (value === null || value === undefined || value === '') return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };
  
  const transformed = ingredients.map(ing => ({
    recipeId: ing.recipeId,
    ingredientId: ing.ingredientId,
    amount: toNumber(ing.amount),
    unitAbbr: ing.unitAbbr,
  }));
  
  writeCSV("recipe_ingredient.csv", transformed);
  console.log(`✓ Transformed ${transformed.length} recipe ingredients`);
}

// Main execution
console.log("Starting data transformation...");
console.log(`All user references will be updated to: ${NEW_USER_ID}`);
console.log("");

transformRecipes();
transformLabels();
transformRecipeLabelConnections();
transformWeekDayConfig();
transformDayPlans();
transformIngredients();
transformUnits();
transformRecipeIngredients();

console.log("\n✅ Data transformation completed!");
console.log(`Transformed files saved to: ${OUTPUT_DIR}`);