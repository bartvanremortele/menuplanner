-- IMPORTANT: This migration needs to be run in a transaction
-- It will convert existing integer IDs to UUIDs while preserving relationships

BEGIN;

-- Step 1: Add new UUID columns (temporarily)
ALTER TABLE "recipe" ADD COLUMN "id_new" text DEFAULT uuid_generate_v4();
ALTER TABLE "ingredient" ADD COLUMN "id_new" text DEFAULT uuid_generate_v4();
ALTER TABLE "label" ADD COLUMN "id_new" text DEFAULT uuid_generate_v4();

-- Step 2: Generate UUIDs for existing records
UPDATE "recipe" SET "id_new" = uuid_generate_v4() WHERE "id_new" IS NULL;
UPDATE "ingredient" SET "id_new" = uuid_generate_v4() WHERE "id_new" IS NULL;
UPDATE "label" SET "id_new" = uuid_generate_v4() WHERE "id_new" IS NULL;

-- Step 3: Add new foreign key columns
ALTER TABLE "day_plan" ADD COLUMN "recipe_id_new" text;
ALTER TABLE "day_plan" ADD COLUMN "label_id_new" text;
ALTER TABLE "week_day_config" ADD COLUMN "label_id_new" text;
ALTER TABLE "recipe_ingredient" ADD COLUMN "recipe_id_new" text;
ALTER TABLE "recipe_ingredient" ADD COLUMN "ingredient_id_new" text;
ALTER TABLE "recipe_label_connection" ADD COLUMN "recipe_id_new" text;
ALTER TABLE "recipe_label_connection" ADD COLUMN "label_id_new" text;

-- Step 4: Update foreign keys with new UUIDs based on relationships
UPDATE "day_plan" dp 
SET "recipe_id_new" = r."id_new" 
FROM "recipe" r 
WHERE dp."recipe_id" = r."id";

UPDATE "day_plan" dp 
SET "label_id_new" = l."id_new" 
FROM "label" l 
WHERE dp."label_id" = l."id";

UPDATE "week_day_config" wdc 
SET "label_id_new" = l."id_new" 
FROM "label" l 
WHERE wdc."label_id" = l."id";

UPDATE "recipe_ingredient" ri 
SET "recipe_id_new" = r."id_new" 
FROM "recipe" r 
WHERE ri."recipe_id" = r."id";

UPDATE "recipe_ingredient" ri 
SET "ingredient_id_new" = i."id_new" 
FROM "ingredient" i 
WHERE ri."ingredient_id" = i."id";

UPDATE "recipe_label_connection" rlc 
SET "recipe_id_new" = r."id_new" 
FROM "recipe" r 
WHERE rlc."recipe_id" = r."id";

UPDATE "recipe_label_connection" rlc 
SET "label_id_new" = l."id_new" 
FROM "label" l 
WHERE rlc."label_id" = l."id";

-- Step 5: Drop old constraints
ALTER TABLE "day_plan" DROP CONSTRAINT IF EXISTS "day_plan_recipe_id_recipe_id_fk";
ALTER TABLE "day_plan" DROP CONSTRAINT IF EXISTS "day_plan_label_id_label_id_fk";
ALTER TABLE "week_day_config" DROP CONSTRAINT IF EXISTS "week_day_config_label_id_label_id_fk";
ALTER TABLE "recipe_ingredient" DROP CONSTRAINT IF EXISTS "recipe_ingredient_recipe_id_recipe_id_fk";
ALTER TABLE "recipe_ingredient" DROP CONSTRAINT IF EXISTS "recipe_ingredient_ingredient_id_ingredient_id_fk";
ALTER TABLE "recipe_label_connection" DROP CONSTRAINT IF EXISTS "recipe_label_connection_recipe_id_recipe_id_fk";
ALTER TABLE "recipe_label_connection" DROP CONSTRAINT IF EXISTS "recipe_label_connection_label_id_label_id_fk";

-- Drop primary key constraints
ALTER TABLE "recipe" DROP CONSTRAINT IF EXISTS "recipe_pkey";
ALTER TABLE "ingredient" DROP CONSTRAINT IF EXISTS "ingredient_pkey";
ALTER TABLE "label" DROP CONSTRAINT IF EXISTS "label_pkey";
ALTER TABLE "recipe_ingredient" DROP CONSTRAINT IF EXISTS "recipe_ingredient_recipe_id_ingredient_id_pk";
ALTER TABLE "recipe_label_connection" DROP CONSTRAINT IF EXISTS "recipe_label_connection_recipe_id_label_id_pk";
ALTER TABLE "day_plan" DROP CONSTRAINT IF EXISTS "day_plan_pkey";
ALTER TABLE "day_plan" DROP CONSTRAINT IF EXISTS "day_plan_day_user_id_recipe_id_pk";
ALTER TABLE "week_day_config" DROP CONSTRAINT IF EXISTS "week_day_config_pkey";
ALTER TABLE "week_day_config" DROP CONSTRAINT IF EXISTS "week_day_config_week_day_user_id_label_id_pk";

-- Step 6: Drop old columns
ALTER TABLE "day_plan" DROP COLUMN "recipe_id";
ALTER TABLE "day_plan" DROP COLUMN "label_id";
ALTER TABLE "week_day_config" DROP COLUMN "label_id";
ALTER TABLE "recipe_ingredient" DROP COLUMN "recipe_id";
ALTER TABLE "recipe_ingredient" DROP COLUMN "ingredient_id";
ALTER TABLE "recipe_label_connection" DROP COLUMN "recipe_id";
ALTER TABLE "recipe_label_connection" DROP COLUMN "label_id";

ALTER TABLE "recipe" DROP COLUMN "id";
ALTER TABLE "ingredient" DROP COLUMN "id";
ALTER TABLE "label" DROP COLUMN "id";

-- Step 7: Rename new columns to original names
ALTER TABLE "recipe" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "ingredient" RENAME COLUMN "id_new" TO "id";
ALTER TABLE "label" RENAME COLUMN "id_new" TO "id";

ALTER TABLE "day_plan" RENAME COLUMN "recipe_id_new" TO "recipe_id";
ALTER TABLE "day_plan" RENAME COLUMN "label_id_new" TO "label_id";
ALTER TABLE "week_day_config" RENAME COLUMN "label_id_new" TO "label_id";
ALTER TABLE "recipe_ingredient" RENAME COLUMN "recipe_id_new" TO "recipe_id";
ALTER TABLE "recipe_ingredient" RENAME COLUMN "ingredient_id_new" TO "ingredient_id";
ALTER TABLE "recipe_label_connection" RENAME COLUMN "recipe_id_new" TO "recipe_id";
ALTER TABLE "recipe_label_connection" RENAME COLUMN "label_id_new" TO "label_id";

-- Step 8: Add back constraints
ALTER TABLE "recipe" ADD PRIMARY KEY ("id");
ALTER TABLE "ingredient" ADD PRIMARY KEY ("id");
ALTER TABLE "label" ADD PRIMARY KEY ("id");

ALTER TABLE "recipe_ingredient" ADD PRIMARY KEY ("recipe_id", "ingredient_id");
ALTER TABLE "recipe_label_connection" ADD PRIMARY KEY ("recipe_id", "label_id");
ALTER TABLE "day_plan" ADD PRIMARY KEY ("day", "user_id", "recipe_id");
ALTER TABLE "week_day_config" ADD PRIMARY KEY ("week_day", "user_id", "label_id");

-- Add foreign key constraints
ALTER TABLE "day_plan" 
  ADD CONSTRAINT "day_plan_recipe_id_recipe_id_fk" 
  FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE;

ALTER TABLE "day_plan" 
  ADD CONSTRAINT "day_plan_label_id_label_id_fk" 
  FOREIGN KEY ("label_id") REFERENCES "label"("id") ON DELETE CASCADE;

ALTER TABLE "week_day_config" 
  ADD CONSTRAINT "week_day_config_label_id_label_id_fk" 
  FOREIGN KEY ("label_id") REFERENCES "label"("id");

ALTER TABLE "recipe_ingredient" 
  ADD CONSTRAINT "recipe_ingredient_recipe_id_recipe_id_fk" 
  FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE;

ALTER TABLE "recipe_ingredient" 
  ADD CONSTRAINT "recipe_ingredient_ingredient_id_ingredient_id_fk" 
  FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE CASCADE;

ALTER TABLE "recipe_label_connection" 
  ADD CONSTRAINT "recipe_label_connection_recipe_id_recipe_id_fk" 
  FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE;

ALTER TABLE "recipe_label_connection" 
  ADD CONSTRAINT "recipe_label_connection_label_id_label_id_fk" 
  FOREIGN KEY ("label_id") REFERENCES "label"("id") ON DELETE CASCADE;

-- Step 9: Ensure NOT NULL constraints
ALTER TABLE "day_plan" ALTER COLUMN "recipe_id" SET NOT NULL;
ALTER TABLE "week_day_config" ALTER COLUMN "label_id" SET NOT NULL;
ALTER TABLE "recipe_ingredient" ALTER COLUMN "recipe_id" SET NOT NULL;
ALTER TABLE "recipe_ingredient" ALTER COLUMN "ingredient_id" SET NOT NULL;
ALTER TABLE "recipe_label_connection" ALTER COLUMN "recipe_id" SET NOT NULL;
ALTER TABLE "recipe_label_connection" ALTER COLUMN "label_id" SET NOT NULL;

COMMIT;