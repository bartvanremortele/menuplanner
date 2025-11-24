import dotenv from "dotenv";
import pLimit from "p-limit";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { ProductDatabase } from "./db/index.js";

dotenv.config();

puppeteer.use(StealthPlugin());

const limit = pLimit(parseInt(process.env.MAX_CONCURRENT_PAGES || "3"));
const SCRAPE_DELAY = parseInt(process.env.SCRAPE_DELAY_MS || "2000");

class CarrefourScraper {
  constructor() {
    this.db = new ProductDatabase();
    this.browser = null;
    this.sessionId = null;
    this.stats = {
      productsFound: 0,
      productsUpdated: 0,
      productsNew: 0,
      errors: [],
    };
  }

  async initialize() {
    console.log("🚀 Initializing Carrefour scraper...");

    this.browser = await puppeteer.launch({
      headless: process.env.HEADLESS === "true",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-features=IsolateOrigins,site-per-process",
        "--window-size=1920,1080",
      ],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });

    this.sessionId = await this.db.startScrapeSession();
    console.log(`📊 Started scrape session #${this.sessionId}`);
  }

  async createPage() {
    const page = await this.browser.newPage();

    await page.setUserAgent(
      process.env.USER_AGENT ||
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "nl-BE,nl;q=0.9,en;q=0.8",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    });

    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 1080 + Math.floor(Math.random() * 100),
    });

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    return page;
  }

  async handleInitialSetup(page) {
    try {
      // Handle language selection
      const languageButtons = await page.$$("button");
      for (const button of languageButtons) {
        const text = await button.evaluate((el) => el.textContent);
        if (text && text.includes("Nederlands")) {
          console.log("🌐 Selecting Dutch language...");
          await button.click();
          await this.delay(1000);
          break;
        }
      }

      // Handle cookies
      const allButtons = await page.$$("button");
      for (const button of allButtons) {
        const text = await button.evaluate((el) => el.textContent);
        if (
          text &&
          (text.includes("Alles aanvaarden") || text.includes("Alles afwijzen"))
        ) {
          console.log("🍪 Handling cookies...");
          await button.click();
          await this.delay(1000);
          break;
        }
      }
    } catch (error) {
      console.log("⚠️ Initial setup issue:", error.message);
    }
  }

  async getCategoryUrls() {
    const page = await this.createPage();

    try {
      console.log("📂 Fetching category URLs from homepage...");
      await page.goto("https://www.carrefour.be/nl", {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      await this.handleInitialSetup(page);
      await this.delay(2000);

      // Extract all data-category-url attributes
      const categoryData = await page.evaluate(() => {
        const categories = [];

        // Find all elements with data-category-url
        const elements = document.querySelectorAll("[data-category-url]");
        elements.forEach((el) => {
          const url = el.getAttribute("data-category-url");
          const name =
            el.textContent?.trim() ||
            el.getAttribute("alt") ||
            el.getAttribute("title") ||
            "Unknown";

          if (url) {
            categories.push({
              url: url.startsWith("http")
                ? url
                : `https://www.carrefour.be${url}`,
              name: name,
            });
          }
        });

        // Remove duplicates
        const uniqueCategories = [];
        const seen = new Set();
        categories.forEach((cat) => {
          if (!seen.has(cat.url)) {
            seen.add(cat.url);
            uniqueCategories.push(cat);
          }
        });

        return uniqueCategories;
      });

      console.log(`✅ Found ${categoryData.length} category URLs`);

      // Log first few for debugging
      console.log("Sample categories:");
      categoryData.slice(0, 5).forEach((cat) => {
        console.log(`  - ${cat.name}: ${cat.url}`);
      });

      return categoryData;
    } catch (error) {
      console.error("❌ Error fetching categories:", error.message);
      return [];
    } finally {
      await page.close();
    }
  }

  async scrapeCategory(categoryUrl, categoryName) {
    const page = await this.createPage();
    const allProducts = [];

    try {
      console.log(`\n🔍 Scraping category: ${categoryName}`);
      console.log(`   URL: ${categoryUrl}`);

      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages && currentPage <= 10) {
        // Limit to 10 pages per category
        const pageUrl =
          currentPage === 1
            ? categoryUrl
            : `${categoryUrl}?page=${currentPage}`;

        console.log(`   📄 Page ${currentPage}...`);
        await page.goto(pageUrl, {
          waitUntil: "networkidle2",
          timeout: 60000,
        });

        await this.delay(2000);

        // Scroll to load lazy content
        await this.autoScroll(page);

        // Extract products using the data-select-item-event-object attribute
        const products = await page.evaluate((category) => {
          const products = [];

          // Find all elements with data-select-item-event-object
          const productElements = document.querySelectorAll(
            "[data-select-item-event-object]",
          );

          productElements.forEach((el) => {
            try {
              const dataStr = el.getAttribute("data-select-item-event-object");
              if (dataStr && dataStr !== "null") {
                // Parse the JSON data (it's HTML encoded)
                const decodedStr = dataStr.replace(/&quot;/g, '"');
                const data = JSON.parse(decodedStr);

                if (
                  data.ecommerce &&
                  data.ecommerce.items &&
                  data.ecommerce.items[0]
                ) {
                  const item = data.ecommerce.items[0];

                  const product = {
                    id: item.item_id,
                    name: item.item_name,
                    brand: item.item_brand,
                    category: category,
                    subcategory: item.item_category2 || item.item_category,
                    price: item.price,
                    inStock: item.stock_status === "available",
                  };

                  // Get additional info from the DOM element
                  const linkEl = el.querySelector('a[href*=".html"]');
                  if (linkEl) {
                    product.productUrl = linkEl.href.startsWith("http")
                      ? linkEl.href
                      : `https://www.carrefour.be${linkEl.href}`;
                  }

                  const imgEl = el.querySelector("img");
                  if (imgEl) {
                    product.imageUrl = imgEl.src || imgEl.dataset.src;
                  }

                  const pricePerUnitEl = el.querySelector(
                    ".price-per-unit-wrapper",
                  );
                  if (pricePerUnitEl) {
                    product.pricePerUnit = pricePerUnitEl.textContent.trim();
                  }

                  products.push(product);
                }
              }
            } catch (err) {
              console.error("Error parsing product data:", err);
            }
          });

          // If no products found with data attribute, try fallback method
          if (products.length === 0) {
            const tiles = document.querySelectorAll(".product-tile");
            tiles.forEach((tile, index) => {
              try {
                const product = {
                  id: `carrefour_${category}_${index}_${Date.now()}`,
                  category: category,
                };

                // Get product link and extract ID
                const linkEl = tile.querySelector('a[href*=".html"]');
                if (linkEl) {
                  product.productUrl = linkEl.href;
                  const match = linkEl.href.match(/\/(\d+)\.html/);
                  if (match) {
                    product.id = match[1];
                  }
                }

                // Get name
                const nameEl = tile.querySelector(".pdp-link a span");
                if (nameEl) {
                  product.name = nameEl.textContent.trim();
                }

                // Get brand
                const brandEl = tile.querySelector(".brand-wrapper a");
                if (brandEl) {
                  product.brand = brandEl.textContent.trim();
                }

                // Get price
                const priceEl = tile.querySelector(".price .sales .value");
                if (priceEl) {
                  const priceContent = priceEl.getAttribute("content");
                  if (priceContent) {
                    product.price = parseFloat(priceContent);
                  }
                }

                // Get image
                const imgEl = tile.querySelector("img");
                if (imgEl) {
                  product.imageUrl = imgEl.src;
                }

                // Get price per unit
                const unitPriceEl = tile.querySelector(
                  ".price-per-unit-wrapper",
                );
                if (unitPriceEl) {
                  product.pricePerUnit = unitPriceEl.textContent.trim();
                }

                // Check availability
                const unavailable = tile.querySelector(".unavailable-tag");
                product.inStock = !unavailable;

                if (product.name && product.price) {
                  products.push(product);
                }
              } catch (err) {
                console.error("Error extracting product:", err);
              }
            });
          }

          return products;
        }, categoryName);

        console.log(`      ✅ Found ${products.length} products`);
        allProducts.push(...products);

        // Check for next page
        const nextPageExists = await page.$(
          'a[aria-label="Next"], .pagination a:has(.icon-arrow-right):not(.disabled)',
        );
        hasMorePages = nextPageExists !== null && products.length > 0;
        currentPage++;

        if (hasMorePages) {
          await this.delay(SCRAPE_DELAY);
        }
      }

      console.log(`   📊 Total products in category: ${allProducts.length}`);
    } catch (error) {
      console.error(`❌ Error scraping ${categoryName}:`, error.message);
      this.stats.errors.push({
        type: "category_scrape",
        category: categoryName,
        url: categoryUrl,
        message: error.message,
      });
    } finally {
      await page.close();
    }

    return allProducts;
  }

  async autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 200;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight - 1000) {
            clearInterval(timer);
            resolve();
          }
        }, 200);
      });
    });
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async saveProducts(products) {
    for (const product of products) {
      try {
        const result = await this.db.upsertProduct(product);
        if (result === "created") {
          this.stats.productsNew++;
        } else {
          this.stats.productsUpdated++;
        }
        this.stats.productsFound++;
      } catch (error) {
        console.error(
          `❌ Error saving product ${product.name}:`,
          error.message,
        );
        this.stats.errors.push({
          type: "save_product",
          product: product.name,
          message: error.message,
        });
      }
    }
  }

  async run() {
    try {
      await this.initialize();

      // Get category URLs from homepage
      const categories = await this.getCategoryUrls();

      if (categories.length === 0) {
        console.log("❌ No categories found!");
        return;
      }

      console.log(`\n📋 Starting to scrape ${categories.length} categories...`);

      // Scrape each category with rate limiting
      const scrapePromises = categories.map((category) =>
        limit(async () => {
          await this.delay(SCRAPE_DELAY);
          const products = await this.scrapeCategory(
            category.url,
            category.name,
          );
          await this.saveProducts(products);
        }),
      );

      await Promise.all(scrapePromises);

      // Update scrape session
      await this.db.updateScrapeSession(this.sessionId, {
        completedAt: new Date(),
        productsFound: this.stats.productsFound,
        productsUpdated: this.stats.productsUpdated,
        productsNew: this.stats.productsNew,
        errors:
          this.stats.errors.length > 0
            ? JSON.stringify(this.stats.errors)
            : null,
        status: "completed",
        categories: JSON.stringify(categories.map((c) => c.name)),
      });

      console.log("\n✅ Scraping completed!");
      console.log(`📊 Final stats:
        - Categories scraped: ${categories.length}
        - Products found: ${this.stats.productsFound}
        - New products: ${this.stats.productsNew}
        - Updated products: ${this.stats.productsUpdated}
        - Errors: ${this.stats.errors.length}`);

      // Show some sample products
      const sampleProducts = await this.db.searchProducts("", 5);
      if (sampleProducts.length > 0) {
        console.log("\n📦 Sample products saved:");
        sampleProducts.forEach((p) => {
          console.log(`  - ${p.name} (${p.brand}) - €${p.price}`);
        });
      }
    } catch (error) {
      console.error("❌ Fatal error:", error);
      await this.db.updateScrapeSession(this.sessionId, {
        completedAt: new Date(),
        status: "failed",
        errors: JSON.stringify([{ type: "fatal", message: error.message }]),
      });
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the scraper
const scraper = new CarrefourScraper();
scraper.run();
