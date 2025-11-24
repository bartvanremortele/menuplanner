# Recipe Import Feature Architecture

## Architecture Components

### 1. Backend API Structure

- **New tRPC Router**: `packages/api/src/router/admin/import.ts`
  - `analyzeUrl`: Determine URL type (Instagram, recipe website, etc.)
  - `importFromInstagram`: Handle Instagram-specific imports
  - `importFromWeb`: Handle general web URL imports
  - `parseRecipeWithAI`: Common AI parsing endpoint

### 2. Data Extraction Pipeline

#### Instagram Integration:

- Use Instagram Basic Display API or oEmbed API (simpler, no auth required)
- Extract post metadata, image URLs, and caption text
- Send content to LLM for recipe extraction

#### Web Scraping:

- Use native fetch API for static content
- Use Cheerio for HTML parsing (works on Vercel)
- Extract structured data (JSON-LD recipe schema if available)
- For dynamic content, use external scraping service (ScrapingBee, Browserless, or Bright Data)
- Fall back to LLM extraction for unstructured content

#### LLM Processing:

- Use OpenAI GPT-4 for intelligent extraction
- Extract: recipe name, description, ingredients (with amounts/units), instructions, prep/cook time
- Match ingredients to existing database or create new ones

### 3. Database Schema Extensions

```sql
-- New fields for Recipe table
ALTER TABLE recipe ADD COLUMN prep_time_minutes INTEGER;
ALTER TABLE recipe ADD COLUMN cook_time_minutes INTEGER;
ALTER TABLE recipe ADD COLUMN servings INTEGER;
ALTER TABLE recipe ADD COLUMN source_url TEXT;
ALTER TABLE recipe ADD COLUMN imported_at TIMESTAMP;

-- New RecipeInstruction table for step-by-step instructions
CREATE TABLE recipe_instruction (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_recipe_instruction_unique ON recipe_instruction(recipe_id, step_number);
CREATE INDEX idx_recipe_instruction_recipe ON recipe_instruction(recipe_id);

-- New RecipeImportLog table for tracking imports
CREATE TABLE recipe_import_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'success', 'failed')),
  raw_data JSONB,
  parsed_data JSONB,
  recipe_id UUID REFERENCES recipe(id),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by_user_id UUID REFERENCES user(id) NOT NULL
);

CREATE INDEX idx_import_log_status ON recipe_import_log(status);
CREATE INDEX idx_import_log_created_at ON recipe_import_log(created_at);
```

## Implementation Steps

### Phase 1: Core Infrastructure

#### Environment Variables

```bash
# Add to .env.example

# OpenAI API
OPENAI_API_KEY=sk-...

# Instagram/Facebook (for oEmbed API)
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...

# Rate limiting
IMPORT_RATE_LIMIT_PER_HOUR=10
LLM_MAX_TOKENS_PER_REQUEST=2000
```

#### NPM Dependencies

```json
{
  "dependencies": {
    // LLM
    "openai": "^4.0.0",

    // HTML parsing (Vercel-compatible)
    "cheerio": "^1.0.0-rc.12",

    // Utils
    "p-queue": "^7.4.0", // For rate limiting
    "zod": "^3.22.0"
  }
}
```

#### Optional: External Scraping Service (for dynamic content)

```bash
# Choose one if you need to scrape JavaScript-rendered sites:
SCRAPINGBEE_API_KEY=...     # ScrapingBee.com
# OR
BROWSERLESS_API_KEY=...     # Browserless.io
# OR
BRIGHTDATA_API_KEY=...      # BrightData.com
```

### Phase 2: Import Router Implementation

```typescript
// packages/api/src/router/admin/import.ts
export const importRouter = {
  analyzeUrl: adminProcedure
    .input(z.object({ url: z.string().url() }))
    .mutation(async ({ input }) => {
      // Detect URL type and fetch content
    }),

  importRecipe: adminProcedure
    .input(ImportRecipeSchema)
    .mutation(async ({ ctx, input }) => {
      // Main import logic
      const { instructions, ingredients, ...recipeData } = input;

      // 1. Create the recipe
      const [recipe] = await ctx.db
        .insert(Recipe)
        .values({
          ...recipeData,
          createdByUserId: ctx.session.user.id,
        })
        .returning();

      // 2. Add instructions as separate records
      if (instructions.length > 0) {
        await ctx.db.insert(RecipeInstruction).values(
          instructions.map((instruction, index) => ({
            recipeId: recipe.id,
            stepNumber: index + 1,
            instruction,
          })),
        );
      }

      // 3. Add ingredients (match/create as needed)
      // 4. Add labels if provided

      return recipe;
    }),
};
```

### Phase 3: Frontend UI

1. Add "Import Recipe" button on recipes page
2. Create import modal with:
   - URL input field
   - Preview of extracted data
   - Ability to edit before saving
   - Progress indicator for import process

### Phase 4: Ingredient Matching (Using Supabase Features)

- Enable `pg_trgm` extension in Supabase (already available)
- Create GIN index on ingredient names for fast similarity search
- Use PostgreSQL's `similarity()` function for fuzzy matching
- Fall back to creating new ingredients if no match found (similarity < 0.7)
- Show matches in preview with ability to change/confirm mappings

```sql
-- Enable in Supabase SQL Editor (one-time setup)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add GIN index for fast similarity searches
CREATE INDEX ingredient_name_trgm_idx ON ingredient
USING gin (name gin_trgm_ops);
```

## Database Schema (Drizzle)

```typescript
// packages/db/src/schema.ts - Add to existing schema

export const RecipeInstruction = pgTable(
  "recipe_instruction",
  (t) => ({
    id: t.text().notNull().primaryKey().default(uuid),
    recipeId: t
      .text()
      .notNull()
      .references(() => Recipe.id, { onDelete: "cascade" }),
    stepNumber: t.integer().notNull(),
    instruction: t.text().notNull(),
    createdAt: t.timestamp().defaultNow().notNull(),
  }),
  (table) => ({
    uniqueRecipeStep: unique().on(table.recipeId, table.stepNumber),
  }),
);

// Add relations
export const RecipeRelations = relations(Recipe, ({ many }) => ({
  // ... existing relations
  instructions: many(RecipeInstruction),
}));

export const RecipeInstructionRelations = relations(
  RecipeInstruction,
  ({ one }) => ({
    recipe: one(Recipe, {
      fields: [RecipeInstruction.recipeId],
      references: [Recipe.id],
    }),
  }),
);
```

## Zod Schemas

```typescript
// packages/validators/src/import.ts

import { z } from "zod/v4";

export const ParsedIngredientSchema = z.object({
  name: z.string(),
  amount: z.number().positive().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(), // e.g., "finely chopped"
});

export const ImportRecipeSchema = z.object({
  url: z.string().url(),
  name: z.string().min(1).max(256),
  description: z.string(),
  instructions: z.array(z.string()), // Always an array of steps
  ingredients: z.array(ParsedIngredientSchema),
  prepTimeMinutes: z.number().positive().optional(),
  cookTimeMinutes: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  labels: z.array(z.string()).optional(),
});

export const RecipeImportRequestSchema = z.object({
  url: z.string().url(),
  autoMatch: z.boolean().default(true), // Auto-match ingredients
});

export type ParsedIngredient = z.infer<typeof ParsedIngredientSchema>;
export type ImportRecipe = z.infer<typeof ImportRecipeSchema>;
export type RecipeImportRequest = z.infer<typeof RecipeImportRequestSchema>;
```

## LLM Prompt Templates

```typescript
// packages/api/src/services/prompts.ts

export const RECIPE_EXTRACTION_PROMPT = `
Extract recipe information from the following content.
Return a JSON object with this exact structure:

{
  "name": "Recipe name",
  "description": "Brief description",
  "instructions": ["Step 1", "Step 2", ...],
  "ingredients": [
    {
      "name": "ingredient name",
      "amount": numeric amount or null,
      "unit": "unit abbreviation" or null,
      "notes": "preparation notes" or null
    }
  ],
  "prepTimeMinutes": number or null,
  "cookTimeMinutes": number or null,
  "servings": number or null
}

Content to extract from:
{content}

Important:
- Extract amounts as numbers (e.g., "2 cups" -> amount: 2, unit: "cup")
- Use standard unit abbreviations when possible
- Include preparation notes (e.g., "chopped", "diced") in the notes field
- If instructions are in paragraph form, split into logical steps
- Return ONLY valid JSON, no additional text
`;

// Ingredient matching happens in the database, not via LLM
```

## Utility Functions

```typescript
// packages/api/src/services/import-utils.ts

// Database-based ingredient matching using Supabase/PostgreSQL
export async function findMatchingIngredient(
  ctx: Context,
  ingredientName: string,
): Promise<{ id: string; name: string; similarity: number } | null> {
  // Normalize the search term
  const normalized = ingredientName.toLowerCase().trim();

  // Use Supabase's pg_trgm for fuzzy matching
  // This query uses the GIN index for fast similarity search
  const result = await ctx.db.execute(sql`
    SELECT 
      id, 
      name,
      similarity(lower(name), ${normalized}) as similarity
    FROM ingredient
    WHERE similarity(lower(name), ${normalized}) > 0.3
    ORDER BY similarity DESC
    LIMIT 1
  `);

  if (result.rows.length > 0 && result.rows[0].similarity > 0.7) {
    return {
      id: result.rows[0].id,
      name: result.rows[0].name,
      similarity: result.rows[0].similarity,
    };
  }

  // No good match found - will need to create new ingredient
  return null;
}

// Batch matching for all ingredients in a recipe
export async function matchRecipeIngredients(
  ctx: Context,
  parsedIngredients: ParsedIngredient[],
): Promise<Map<string, string | null>> {
  const matches = new Map<string, string | null>();

  for (const ingredient of parsedIngredients) {
    const match = await findMatchingIngredient(ctx, ingredient.name);
    matches.set(ingredient.name, match?.id || null);
  }

  return matches;
}

export function normalizeUnit(unit: string): string {
  const unitMap: Record<string, string> = {
    // Normalize common variations
    tablespoon: "tbsp",
    tablespoons: "tbsp",
    teaspoon: "tsp",
    teaspoons: "tsp",
    pound: "lb",
    pounds: "lb",
    ounce: "oz",
    ounces: "oz",
    gram: "g",
    grams: "g",
    kilogram: "kg",
    kilograms: "kg",
    milliliter: "ml",
    milliliters: "ml",
    liter: "l",
    liters: "l",
    cup: "cup",
    cups: "cup",
  };

  return unitMap[unit.toLowerCase()] || unit.toLowerCase();
}

export function parseIngredientText(text: string): ParsedIngredient {
  // Regex to extract amount, unit, and ingredient
  const pattern = /^([\d\.\/\s]+)?\s*([a-zA-Z]+)?\s+(.+)$/;
  const match = text.match(pattern);

  if (!match) {
    return { name: text, amount: undefined, unit: undefined };
  }

  const [, amountStr, unit, name] = match;

  // Parse amount (handle fractions like "1/2")
  let amount: number | undefined;
  if (amountStr) {
    if (amountStr.includes("/")) {
      const [num, den] = amountStr.split("/").map((s) => parseFloat(s.trim()));
      amount = num / den;
    } else {
      amount = parseFloat(amountStr);
    }
  }

  return {
    name: name.trim(),
    amount,
    unit: unit ? normalizeUnit(unit) : undefined,
  };
}

export function detectUrlType(
  url: string,
): "instagram" | "youtube" | "website" {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.toLowerCase();

  if (hostname.includes("instagram.com")) return "instagram";
  if (hostname.includes("youtube.com") || hostname.includes("youtu.be"))
    return "youtube";
  return "website";
}
```

## Common Cooking Units to Seed

```typescript
const commonUnits = [
  // Volume
  { abbr: "tsp", name: "teaspoon" },
  { abbr: "tbsp", name: "tablespoon" },
  { abbr: "fl oz", name: "fluid ounce" },
  { abbr: "cup", name: "cup" },
  { abbr: "pt", name: "pint" },
  { abbr: "qt", name: "quart" },
  { abbr: "gal", name: "gallon" },
  { abbr: "ml", name: "milliliter" },
  { abbr: "l", name: "liter" },
  { abbr: "dl", name: "deciliter" },

  // Weight
  { abbr: "oz", name: "ounce" },
  { abbr: "lb", name: "pound" },
  { abbr: "g", name: "gram" },
  { abbr: "kg", name: "kilogram" },
  { abbr: "mg", name: "milligram" },

  // Count
  { abbr: "pc", name: "piece" },
  { abbr: "dozen", name: "dozen" },

  // Other
  { abbr: "pinch", name: "pinch" },
  { abbr: "dash", name: "dash" },
  { abbr: "handful", name: "handful" },
  { abbr: "clove", name: "clove" },
  { abbr: "slice", name: "slice" },
  { abbr: "bunch", name: "bunch" },
  { abbr: "can", name: "can" },
  { abbr: "pkg", name: "package" },
  { abbr: "jar", name: "jar" },
];
```

## Error Handling

```typescript
export class ImportError extends Error {
  constructor(
    message: string,
    public code: ImportErrorCode,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ImportError";
  }
}

export enum ImportErrorCode {
  INVALID_URL = "INVALID_URL",
  FETCH_FAILED = "FETCH_FAILED",
  PARSE_FAILED = "PARSE_FAILED",
  LLM_ERROR = "LLM_ERROR",
  RATE_LIMITED = "RATE_LIMITED",
  DUPLICATE_RECIPE = "DUPLICATE_RECIPE",
  INGREDIENT_MATCH_FAILED = "INGREDIENT_MATCH_FAILED",
  SAVE_FAILED = "SAVE_FAILED",
}
```

## Frontend Import Modal Types

```typescript
// apps/nextjs/src/features/recipes/components/import-modal/types.ts

export interface ImportState {
  step: "input" | "processing" | "preview" | "mapping" | "saving";
  url: string;
  extractedData?: ImportRecipe;
  ingredientMappings?: Map<string, string>; // parsed name -> ingredient ID
  error?: string;
}

export interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (recipeId: string) => void;
}
```

## Technical Implementation Details

### Instagram oEmbed API (No Auth Required)

```typescript
const response = await fetch(
  `https://graph.facebook.com/v12.0/instagram_oembed?url=${encodeURIComponent(instagramUrl)}&access_token=${fbToken}`,
);
const data = await response.json();
// Extract: data.thumbnail_url, data.title, data.author_name
```

### Recipe Schema Detection (Vercel-Compatible)

```typescript
// Vercel-compatible web scraping
export async function fetchRecipeContent(url: string): Promise<string> {
  // For static sites, use regular fetch
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; RecipeImporter/1.0)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  return response.text();
}

export function extractRecipeData(html: string) {
  const $ = cheerio.load(html);

  // Try to find JSON-LD structured data first
  const jsonLdScripts = $('script[type="application/ld+json"]');

  for (const script of jsonLdScripts) {
    try {
      const data = JSON.parse($(script).html() || "");
      if (data["@type"] === "Recipe" || data["@type"]?.includes("Recipe")) {
        // Found structured recipe data - no LLM needed!
        return {
          name: data.name,
          description: data.description,
          instructions: Array.isArray(data.recipeInstructions)
            ? data.recipeInstructions.map((i: any) => i.text || i)
            : [data.recipeInstructions],
          ingredients: data.recipeIngredient || [],
          prepTimeMinutes: parseISO8601Duration(data.prepTime),
          cookTimeMinutes: parseISO8601Duration(data.cookTime),
          servings: data.recipeYield,
          imageUrl: data.image?.url || data.image,
        };
      }
    } catch (e) {
      // Invalid JSON, continue searching
    }
  }

  // No structured data found - extract visible text for LLM
  const title = $("h1").first().text() || $("title").text();
  const content = $("body").text();

  return { title, content, requiresLLM: true };
}

// For dynamic sites that need JavaScript rendering
export async function fetchWithBrowserless(url: string): Promise<string> {
  const response = await fetch("https://chrome.browserless.io/content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.BROWSERLESS_API_KEY}`,
    },
    body: JSON.stringify({
      url,
      waitFor: 2000, // Wait for dynamic content
    }),
  });

  return response.text();
}
```

## Example Flow

1. User pastes Instagram URL: `https://instagram.com/p/ABC123`
2. System fetches post data via oEmbed/API
3. Extracts image and caption text
4. Sends to GPT-4 with prompt:
   ```
   Extract recipe information from this Instagram post.
   Return JSON with: name, description, ingredients (with amounts),
   instructions (as array), prep_time, cook_time, servings
   ```
5. Parses response, matches ingredients to DB
6. Shows preview to user for confirmation
7. Creates recipe with all associations

## Testing URLs for Development

```javascript
const testUrls = {
  instagram: [
    "https://www.instagram.com/p/ABC123/",
    "https://www.instagram.com/reel/XYZ789/",
  ],
  recipeWebsites: [
    "https://www.allrecipes.com/recipe/...",
    "https://www.bbcgoodfood.com/recipes/...",
    "https://cooking.nytimes.com/recipes/...",
  ],
  structuredData: [
    // Sites known to use Recipe schema.org
    "https://www.seriouseats.com/recipes/...",
    "https://www.bonappetit.com/recipe/...",
  ],
};
```

## Security Considerations

1. **URL Validation**: Whitelist allowed domains initially
2. **Content Sanitization**: Strip all HTML/scripts from imported content
3. **Rate Limiting**: Prevent abuse of expensive LLM APIs
4. **User Permissions**: Only admin users can import
5. **Data Privacy**: Don't store raw social media data longer than necessary
