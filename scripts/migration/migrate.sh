#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Menu Planner Database Migration${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Step 1: Dump data from Render
echo -e "${YELLOW}Step 1: Dumping data from Render database...${NC}"
./scripts/migration/dump-render-db.sh

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to dump database. Exiting.${NC}"
    exit 1
fi

echo ""

# Step 2: Transform data
echo -e "${YELLOW}Step 2: Transforming data...${NC}"
pnpm tsx scripts/migration/transform-data.ts

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to transform data. Exiting.${NC}"
    exit 1
fi

echo ""

# Step 3: Import to Supabase
echo -e "${YELLOW}Step 3: Importing data to Supabase...${NC}"
echo -e "${RED}⚠️  WARNING: This will modify your Supabase database!${NC}"
echo -e "Press Enter to continue or Ctrl+C to cancel..."
read

pnpm tsx scripts/migration/import-to-supabase.ts

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migration completed successfully!${NC}"
else
    echo ""
    echo -e "${RED}❌ Migration failed. Please check the errors above.${NC}"
    exit 1
fi