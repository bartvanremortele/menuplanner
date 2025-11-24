Scraper for Carrefour Belgium products. Stores data in `apps/scraper/products.db` (SQLite).

Setup

- Copy env: `cp apps/scraper/.env.example apps/scraper/.env` (tweak if needed)
- Install deps: `pnpm i`

Commands

- `pnpm -F @menuplanner/scraper scrape`: full scrape (respects `.env` concurrency/delay)
- `pnpm -F @menuplanner/scraper scrape:quick`: fast dev run (limited categories/pagination)
  - Env knobs: `QUICK_CATEGORIES` (1), `QUICK_MAX_CLICKS` (2), `QUICK_PER_CATEGORY` (150)
- `pnpm -F @menuplanner/scraper db:generate` | `db:migrate` | `db:studio`: manage/view DB schema
- `pnpm -F @menuplanner/scraper cleanup [--days=60] [--delete]`: deactivate (default) or delete products not scraped since cutoff
- `node apps/scraper/scripts/inspect.js`: quick DB summary (totals, top categories, samples)

Notes

- Upserts mark products as active and refresh `last_scraped`.
- `cleanup` deactivates by default; add `--delete` to remove rows.

# Carrefour Belgium Product Scraper

A robust web scraper for collecting product information from Carrefour Belgium's website.

## Features

- 🛡️ Stealth mode to bypass anti-scraping measures
- 📊 SQLite database with Drizzle ORM
- 🔍 Product search functionality
- 📁 JSON export capability
- 📈 Scrape history tracking
- 🎯 Category-based scraping
- ⚡ Concurrent scraping with rate limiting

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
MAX_CONCURRENT_PAGES=3          # Number of concurrent browser pages
HEADLESS=true                   # Run browser in headless mode
SCRAPE_DELAY_MS=2000           # Delay between requests (ms)
DATABASE_PATH=./products.db     # Database file location
```

3. Initialize the database:

```bash
npm run db:generate
npm run db:migrate
```

## Usage

### Interactive CLI

Run the interactive CLI menu:

```bash
npm start
```

Options available:

1. **Run full scrape** - Scrapes all products from Carrefour.be
2. **View scrape history** - Shows recent scraping sessions
3. **Search products** - Search products in the database
4. **Export to JSON** - Export all products to a JSON file
5. **Show categories** - List all product categories

### Direct Scraping

Run the scraper directly:

```bash
npm run scrape
```

### Database Management

View and manage the database:

```bash
npm run db:studio
```

## How It Works

1. **Category Discovery**: The scraper first navigates to Carrefour.be and attempts to discover all product categories
2. **Product Collection**: For each category, it collects product information including:
   - Product name and ID
   - Brand
   - Price and unit price
   - Image URLs
   - Product URLs
   - Category/subcategory
3. **Database Storage**: Products are stored in a local SQLite database with upsert logic (update if exists, create if new)
4. **Session Tracking**: Each scrape session is logged with statistics

## Anti-Scraping Measures

The scraper implements several techniques to avoid detection:

- Puppeteer Stealth plugin
- Randomized viewport sizes
- Real user agent strings
- Request delays
- Proper header configuration
- Cookie banner handling

## Database Schema

### Products Table

- `id` - Unique product identifier
- `name` - Product name
- `brand` - Brand name
- `category` - Main category
- `subcategory` - Subcategory
- `price` - Current price
- `pricePerUnit` - Price per unit (e.g., "€2.50/kg")
- `imageUrl` - Product image URL
- `productUrl` - Product page URL
- `description` - Product description
- `barcode` - EAN/barcode
- `nutritionFacts` - Nutrition information (JSON)
- `ingredients` - Ingredient list
- `inStock` - Stock availability
- `lastScraped` - Last update timestamp

### Scrape History Table

- Tracks each scraping session
- Records products found/updated/new
- Stores error information
- Logs categories scraped

## Limitations

- Carrefour.be has strong anti-bot protection that may block automated access
- The scraper uses fallback category URLs if automatic discovery fails
- Pagination is detected but not fully implemented yet
- Product details scraping (nutrition, ingredients) requires additional requests

## Troubleshooting

### "Sorry, you have been blocked" error

- The website has detected automated access
- Try reducing `MAX_CONCURRENT_PAGES` in .env
- Increase `SCRAPE_DELAY_MS` for slower scraping
- Consider using a VPN or proxy

### No products found

- Check if the website structure has changed
- Verify category URLs are still valid
- Review browser console for errors

### Database errors

- Ensure write permissions for database file
- Run migrations: `npm run db:migrate`
- Check disk space availability
