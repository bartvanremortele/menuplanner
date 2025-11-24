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

    // Quick-scrape options for development
    this.quick = process.env.QUICK_SCRAPE === "true";
    this.quickCategories = parseInt(process.env.QUICK_CATEGORIES || "1");
    this.quickMaxClicks = parseInt(process.env.QUICK_MAX_CLICKS || "2");
    this.quickMaxPerCategory = parseInt(
      process.env.QUICK_PER_CATEGORY || "150",
    );
  }

  async initialize() {
    console.log("🚀 Initializing Carrefour scraper...");

    this.browser = await puppeteer.launch({
      headless: process.env.HEADLESS === "true",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
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
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "nl-BE,nl;q=0.9,en;q=0.8",
    });

    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    return page;
  }

  async handleInitialSetup(page) {
    try {
      // Wait for page to load
      await this.delay(2000);

      // Handle language selection modal - look for the country selector
      try {
        // Check if language selector is present
        const languageSelector = await page.$(
          ".country-selector__container, .country-selector-popup",
        );
        if (languageSelector) {
          console.log("🌐 Found language selector modal");

          // Click the Nederlands link using simple selector
          const nlLink = await page.$('a[data-locale="default"]');
          if (nlLink) {
            console.log("🌐 Clicking Nederlands link...");
            await nlLink.click();
            await this.delay(3000);
          } else {
            // Fallback: click any link with Nederlands text
            const clicked = await page.evaluate(() => {
              const links = Array.from(
                document.querySelectorAll("a.country-selector__button"),
              );
              const nlLink = links.find((link) =>
                link.textContent.trim().includes("Nederlands"),
              );
              if (nlLink) {
                nlLink.click();
                return true;
              }
              return false;
            });
            if (clicked) {
              console.log("🌐 Selected Dutch language");
            }
            await this.delay(3000);
          }
        }
      } catch (e) {
        console.log("⚠️ Language selection error:", e.message);
      }

      // Handle cookie consent - wait for it to appear
      await this.delay(1000);

      // Try multiple cookie consent selectors
      const cookieSelectors = [
        "#onetrust-accept-btn-handler",
        'button[id*="accept-all"]',
        'button[id*="acceptAll"]',
        "button.onetrust-accept",
        "button.accept-all",
      ];

      let cookieHandled = false;
      for (const selector of cookieSelectors) {
        try {
          const button = await page.$(selector);
          if (button) {
            console.log("🍪 Found cookie button with selector:", selector);
            await button.click();
            cookieHandled = true;
            await this.delay(2000);
            break;
          }
        } catch (e) {
          // Try next selector
        }
      }

      if (!cookieHandled) {
        // Try text-based approach
        const clicked = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll("button"));
          const acceptBtn = buttons.find((btn) => {
            const text = btn.textContent.toLowerCase();
            return (
              text.includes("alles aanvaarden") ||
              text.includes("alles accepteren") ||
              text.includes("accepteer alles") ||
              text.includes("accept all")
            );
          });
          if (acceptBtn) {
            acceptBtn.click();
            return true;
          }
          return false;
        });

        if (clicked) {
          console.log("🍪 Accepted cookies");
          await this.delay(2000);
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
          let name =
            el.textContent?.trim() ||
            el.getAttribute("alt") ||
            el.getAttribute("title") ||
            "";
          // Derive a readable name from the URL slug when the element has no text
          if (!name || name.toLowerCase() === "unknown") {
            try {
              const u = new URL(url, location.origin);
              const slug = (u.pathname.split("/").filter(Boolean).pop() || "")
                .replace(/\.html$/i, "")
                .replace(/-/g, " ");
              const title = decodeURIComponent(slug).trim();
              if (title) {
                name = title.charAt(0).toUpperCase() + title.slice(1);
              }
            } catch (_) {
              // ignore
            }
          }
          if (!name) name = "Unknown";

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
      return categoryData;
    } catch (error) {
      console.error("❌ Error fetching categories:", error.message);
      return [];
    } finally {
      await page.close();
    }
  }

  async extractProductsFromPage(page, categoryName) {
    return await page.evaluate((category) => {
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

      return products;
    }, categoryName);
  }

  async scrapeCategory(categoryUrl, categoryName) {
    const page = await this.createPage();
    const allProducts = [];

    try {
      console.log(`\n🔍 Scraping category: ${categoryName}`);

      await page.goto(categoryUrl, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      await this.delay(2000);

      let loadMoreClicks = 0;
      const maxClicks = this.quick ? this.quickMaxClicks : 20; // Limit to prevent infinite loops

      while (loadMoreClicks < maxClicks) {
        // Extract products currently on page
        const products = await this.extractProductsFromPage(page, categoryName);

        // Clear and add new products (to avoid duplicates)
        const existingIds = new Set(allProducts.map((p) => p.id));
        const newProducts = products.filter((p) => !existingIds.has(p.id));
        allProducts.push(...newProducts);

        console.log(`   📦 Total products so far: ${allProducts.length}`);

        // In quick mode, stop early once we hit per-category threshold
        if (this.quick && allProducts.length >= this.quickMaxPerCategory) {
          console.log(
            `   ⏹️ Quick mode: reached ${this.quickMaxPerCategory} products in ${categoryName}`,
          );
          break;
        }

        // Look for "Toon meer producten" button
        const loadMoreButton = await page.$("button.more[data-url]");

        if (loadMoreButton) {
          // Check if it's the right button
          const isLoadMore = await loadMoreButton.evaluate((btn) =>
            btn.textContent.includes("Toon meer producten"),
          );

          if (isLoadMore) {
            console.log(
              `   ⏳ Loading more products... (click ${loadMoreClicks + 1})`,
            );
            await loadMoreButton.click();
            await this.delay(3000);
            loadMoreClicks++;
          } else {
            console.log("   ✅ No more products to load");
            break;
          }
        } else {
          // Try alternative approach
          const clicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll("button"));
            const btn = buttons.find((b) =>
              b.textContent.includes("Toon meer producten"),
            );
            if (btn) {
              btn.click();
              return true;
            }
            return false;
          });

          if (clicked) {
            console.log(
              `   ⏳ Loading more products... (click ${loadMoreClicks + 1})`,
            );
            await this.delay(3000);
            loadMoreClicks++;
          } else {
            console.log("   ✅ No more products to load");
            break;
          }
        }
      }

      console.log(
        `   ✅ Scraped ${allProducts.length} products from ${categoryName}`,
      );
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

      let categoriesToScrape = categories;
      if (this.quick) {
        categoriesToScrape = categories.slice(0, this.quickCategories);
        console.log(
          `\n⚡ Quick mode enabled: scraping ${categoriesToScrape.length} category(ies), max ${this.quickMaxPerCategory} products each, ${this.quickMaxClicks} pagination clicks.`,
        );
      }

      console.log(
        `\n📋 Starting to scrape ${categoriesToScrape.length} categories...`,
      );

      // Scrape each category with rate limiting
      for (const category of categoriesToScrape) {
        await this.delay(SCRAPE_DELAY);
        const products = await this.scrapeCategory(category.url, category.name);
        await this.saveProducts(products);
      }

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
        categories: JSON.stringify(categoriesToScrape.map((c) => c.name)),
      });

      console.log("\n✅ Scraping completed!");
      console.log(`📊 Final stats:
        - Categories scraped: ${categories.length}
        - Products found: ${this.stats.productsFound}
        - New products: ${this.stats.productsNew}
        - Updated products: ${this.stats.productsUpdated}
        - Errors: ${this.stats.errors.length}`);
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
