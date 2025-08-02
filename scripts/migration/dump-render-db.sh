#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting database dump from Render...${NC}"

# Database connection details
OLD_DB_URL="postgresql://menuplanner_db_9vfh_user:cQ6sDvcvXRr4Hp56xkSrztRXQomTIwYP@dpg-cdnpeamn6mpuqrs28sd0-a.frankfurt-postgres.render.com/menuplanner_db_9vfh"
OUTPUT_DIR="./scripts/migration/data"

# Create output directory
mkdir -p $OUTPUT_DIR

# Tables to export (excluding auth-related tables)
TABLES=(
    "Recipe"
    "Label"
    "RecipeLabelConnection"
    "WeekDayConfig"
    "DayPlan"
    "Ingredient"
    "Unit"
    "RecipeIngredient"
)

echo -e "${YELLOW}Dumping tables...${NC}"

# Dump each table as CSV for easier manipulation
for table in "${TABLES[@]}"; do
    echo -e "Dumping table: ${table}"
    
    # Convert to lowercase for filename only
    lowercase_filename=$(echo "$table" | tr '[:upper:]' '[:lower:]')
    
    # Export to CSV - use original PascalCase table name in query
    psql "$OLD_DB_URL" -c "\COPY (SELECT * FROM \"$table\") TO STDOUT WITH CSV HEADER" > "$OUTPUT_DIR/${lowercase_filename}.csv"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully dumped $table${NC}"
    else
        echo -e "${RED}✗ Failed to dump $table${NC}"
    fi
done

echo -e "${GREEN}Database dump completed!${NC}"
echo -e "${YELLOW}Files saved to: $OUTPUT_DIR${NC}"