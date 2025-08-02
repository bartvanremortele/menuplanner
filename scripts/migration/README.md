# Database Migration: Render to Supabase

This directory contains scripts to migrate data from the old Menu Planner database (on Render) to the new Supabase database.

## Prerequisites

1. PostgreSQL client (`psql`) installed
2. Node.js and pnpm installed
3. Access to both databases
4. Environment variables configured (`.env` file with Supabase connection)

## Migration Overview

The migration process handles the following changes:

1. **User References**: All user references are updated to point to a single Supabase user ID
2. **Table Name Changes**: Snake_case naming convention for new schema
3. **Schema Differences**: Adapted from Prisma to Drizzle ORM schema

## Tables Migrated

- Recipe
- Label
- RecipeLabelConnection
- WeekDayConfig
- DayPlan
- Ingredient
- Unit
- RecipeIngredient

## Usage

### Option 1: Run Complete Migration

```bash
./scripts/migration/migrate.sh
```

This will:
1. Dump data from Render database
2. Transform data (update user references, fix naming)
3. Import to Supabase

### Option 2: Run Steps Individually

1. **Dump data from Render:**
   ```bash
   ./scripts/migration/dump-render-db.sh
   ```

2. **Transform data:**
   ```bash
   pnpm tsx scripts/migration/transform-data.ts
   ```

3. **Import to Supabase:**
   ```bash
   pnpm tsx scripts/migration/import-to-supabase.ts
   ```

## Directory Structure

```
scripts/migration/
├── dump-render-db.sh      # Dumps data from Render DB to CSV
├── transform-data.ts      # Transforms data (updates user refs, etc.)
├── import-to-supabase.ts  # Imports transformed data to Supabase
├── migrate.sh            # Main migration orchestrator
├── data/                 # Raw CSV dumps (created by dump script)
└── transformed/          # Transformed CSV files (created by transform script)
```

## Important Notes

- **User ID**: All user references are updated to: `zQQ2136sKAeML90RHmB9hLM6Vin8tbpm`
- **Sequences**: The import script properly updates PostgreSQL sequences
- **Duplicates**: The scripts handle duplicate entries gracefully with `ON CONFLICT DO NOTHING`

## Troubleshooting

1. **Connection Issues**: Ensure you have network access to both databases
2. **Missing psql**: Install PostgreSQL client tools
3. **Permission Errors**: Check database user permissions
4. **Foreign Key Violations**: The import order respects FK constraints