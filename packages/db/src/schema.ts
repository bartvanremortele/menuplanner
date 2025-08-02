import { sql } from "drizzle-orm";
import { pgTable, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// Import user from auth-schema for references
import { user } from "./auth-schema";

// Recipe table
export const Recipe = pgTable("recipe", (t) => ({
  id: t.integer().notNull().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar({ length: 256 }).notNull().unique(),
  description: t.text().notNull(),
  imageKey: t.varchar({ length: 256 }),
  createdByUserId: t
    .text()
    .notNull()
    .references(() => user.id),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

// Label table
export const Label = pgTable("label", (t) => ({
  id: t.integer().notNull().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar({ length: 256 }).notNull().unique(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

// RecipeLabelConnection table
export const RecipeLabelConnection = pgTable(
  "recipe_label_connection",
  (t) => ({
    recipeId: t
      .integer()
      .notNull()
      .references(() => Recipe.id, { onDelete: "cascade" }),
    labelId: t
      .integer()
      .notNull()
      .references(() => Label.id, { onDelete: "cascade" }),
    assignedAt: t.timestamp().defaultNow().notNull(),
    assignedByUserId: t
      .text()
      .notNull()
      .references(() => user.id),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.recipeId, table.labelId] }),
  }),
);

// WeekDayConfig table
export const WeekDayConfig = pgTable(
  "week_day_config",
  (t) => ({
    weekDay: t.integer().notNull(),
    labelId: t
      .integer()
      .notNull()
      .references(() => Label.id),
    userId: t
      .text()
      .notNull()
      .references(() => user.id),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.weekDay, table.userId, table.labelId],
    }),
  }),
);

// DayPlan table
export const DayPlan = pgTable(
  "day_plan",
  (t) => ({
    day: t.timestamp().notNull(),
    recipeId: t
      .integer()
      .notNull()
      .references(() => Recipe.id, { onDelete: "cascade" }),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    labelId: t.integer().references(() => Label.id, { onDelete: "cascade" }),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.day, table.userId, table.recipeId],
    }),
  }),
);

// Ingredient table
export const Ingredient = pgTable("ingredient", (t) => ({
  id: t.integer().notNull().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar({ length: 256 }).notNull(),
  url: t.text(),
  kj: t.real(),
  kcal: t.real(),
  water: t.real(),
  eiwit: t.real(),
  koolhydraten: t.real(),
  suikers: t.real(),
  vet: t.real(),
  verzadigdVet: t.real(),
  enkelvoudigOnverzadigdVet: t.real(),
  meervoudigOnverzadigdVet: t.real(),
  cholesterol: t.real(),
  voedingsvezel: t.real(),
  gevoel: t.real(),
  gezondheid: t.real(),
}));

// Unit table
export const Unit = pgTable("unit", (t) => ({
  abbr: t.varchar({ length: 10 }).notNull().primaryKey(),
  name: t.varchar({ length: 256 }).notNull(),
}));

// RecipeIngredient table
export const RecipeIngredient = pgTable(
  "recipe_ingredient",
  (t) => ({
    recipeId: t
      .integer()
      .notNull()
      .references(() => Recipe.id, { onDelete: "cascade" }),
    ingredientId: t
      .integer()
      .notNull()
      .references(() => Ingredient.id, { onDelete: "cascade" }),
    amount: t.real().notNull(),
    unitAbbr: t
      .varchar({ length: 10 })
      .notNull()
      .references(() => Unit.abbr),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.recipeId, table.ingredientId] }),
  }),
);

// Create insert schemas
export const CreateRecipeSchema = createInsertSchema(Recipe, {
  name: z.string().max(256),
  description: z.string(),
});

export const CreateLabelSchema = createInsertSchema(Label, {
  name: z.string().max(256),
});

export const CreateIngredientSchema = createInsertSchema(Ingredient, {
  name: z.string().max(256),
});

export const CreateUnitSchema = createInsertSchema(Unit, {
  abbr: z.string().max(10),
  name: z.string().max(256),
});

export const CreateRecipeIngredientSchema = createInsertSchema(
  RecipeIngredient,
  {
    amount: z.number().positive(),
  },
);

export const CreateDayPlanSchema = createInsertSchema(DayPlan, {
  day: z.date(),
});

export * from "./auth-schema";
