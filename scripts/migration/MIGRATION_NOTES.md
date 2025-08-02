# Migration Notes and Considerations

## Critical Issues Found During Review

### 1. **User ID Type Mismatch**
- **Old Schema**: User IDs are integers (`Int`)
- **New Schema**: User IDs are text/strings (`text` references to auth schema)
- **Impact**: Direct migration will fail due to type mismatch
- **Solution**: The new schema in Drizzle needs to be updated to handle this properly

### 2. **Table Name Casing**
- **Old Schema**: Uses PascalCase (e.g., `Recipe`, `Label`)
- **New Schema**: Uses snake_case (e.g., `recipe`, `label`)
- **Handled**: The scripts correctly handle this transformation

### 3. **Column Name Changes**
- `image_key` → `imageKey` (in Recipe table)
- `verzadigd_vet` → `verzadigdVet` (in Ingredient table)
- `enkelvoudig_onverzadigd_vet` → `enkelvoudigOnverzadigdVet`
- `meervoudig_onverzadigd_vet` → `meervoudigOnverzadigdVet`

### 4. **Foreign Key Relationships**
All user references in the old data need to be replaced with the single Supabase user ID:
- `Recipe.createdByUserId`
- `RecipeLabelConnection.assignedByUserId`
- `WeekDayConfig.userId`
- `DayPlan.userId`

## Migration Order (Respects FK Constraints)

1. Units (no dependencies)
2. Ingredients (no dependencies)
3. Labels (no dependencies)
4. Recipes (depends on user)
5. RecipeLabelConnection (depends on recipes, labels, user)
6. RecipeIngredient (depends on recipes, ingredients, units)
7. WeekDayConfig (depends on labels, user)
8. DayPlan (depends on recipes, user, labels)

## Data Validation Checklist

Before running migration:
- [ ] Verify Supabase user exists with ID: `zQQ2136sKAeML90RHmB9hLM6Vin8tbpm`
- [ ] Ensure database is empty or you're okay with potential duplicates
- [ ] Back up any existing data in Supabase
- [ ] Test connection to both databases

After migration:
- [ ] Verify row counts match between source and destination
- [ ] Check that all foreign key relationships are intact
- [ ] Test a few recipes to ensure data integrity
- [ ] Verify sequences are properly set for auto-increment fields