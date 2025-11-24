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

    // Set user agent
    await page.setUserAgent(
      process.env.USER_AGENT ||
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    // Set extra headers
    await page.setExtraHTTPHeaders({
      "Accept-Language": "nl-BE,nl;q=0.9,en;q=0.8",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    });

    // Randomize viewport slightly
    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 1080 + Math.floor(Math.random() * 100),
    });

    // Handle dialog boxes
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    return page;
  }

  async handleInitialSetup(page) {
    try {
      // Handle language selection modal if it appears
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

      // Handle cookie consent - try multiple approaches
      const cookieSelectors = [
        "button#onetrust-accept-btn-handler",
        'button[id*="accept"]',
        ".cookie-accept",
        'button[class*="accept"]',
      ];

      for (const selector of cookieSelectors) {
        try {
          const button = await page.$(selector);
          if (button) {
            console.log("🍪 Accepting cookies...");
            await button.click();
            await this.delay(1000);
            break;
          }
        } catch (e) {
          // Continue with next selector
        }
      }

      // Also try text-based cookie accept
      const allButtons = await page.$$("button");
      for (const button of allButtons) {
        const text = await button.evaluate((el) => el.textContent);
        if (
          text &&
          (text.includes("Alles aanvaarden") || text.includes("Alles afwijzen"))
        ) {
          console.log("🍪 Accepting cookies via text match...");
          await button.click();
          await this.delay(1000);
          break;
        }
      }
    } catch (error) {
      console.log("⚠️ Could not handle initial setup:", error.message);
    }
  }

  async searchProducts(searchTerm) {
    const page = await this.createPage();
    const products = [];

    try {
      console.log(`🔍 Searching for: ${searchTerm}`);

      // Go to the main page first
      await page.goto("https://www.carrefour.be/nl", {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      await this.handleInitialSetup(page);

      // Wait for search box and search
      await page.waitForSelector(
        'input[type="search"], input[placeholder*="Chips"], input[name="search"]',
        { timeout: 10000 },
      );

      const searchInput = await page.$(
        'input[type="search"], input[placeholder*="Chips"], input[name="search"]',
      );
      if (searchInput) {
        await searchInput.click();
        await searchInput.type(searchTerm);
        await page.keyboard.press("Enter");

        // Wait for search results
        await this.delay(5000);

        // Extract products from search results
        const extractedProducts = await page.evaluate(() => {
          const products = [];

          // Try multiple selectors for product cards
          const productSelectors = [
            '[data-testid*="product"]',
            ".product-card",
            ".product-item",
            'article[class*="product"]',
            '[class*="ProductCard"]',
            '[class*="product-tile"]',
            ".search-product-card",
            'div[class*="productItem"]',
          ];

          let productElements = [];
          for (const selector of productSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              productElements = Array.from(elements);
              console.log(
                `Found ${elements.length} products with selector: ${selector}`,
              );
              break;
            }
          }

          productElements.forEach((el) => {
            try {
              const product = {};

              // Extract product name
              const nameSelectors = [
                "h2",
                "h3",
                "h4",
                ".product-name",
                '[class*="title"]',
                '[class*="name"]',
                'a[class*="link"]',
              ];
              for (const selector of nameSelectors) {
                const nameEl = el.querySelector(selector);
                if (nameEl?.textContent) {
                  product.name = nameEl.textContent.trim();
                  break;
                }
              }

              // Extract price
              const priceSelectors = [
                ".price",
                '[class*="price"]:not([class*="unit"])',
                'span[class*="euro"]',
                '[class*="Price"]',
              ];
              for (const selector of priceSelectors) {
                const priceEl = el.querySelector(selector);
                if (priceEl?.textContent) {
                  const priceText = priceEl.textContent
                    .replace(/[^0-9,.-]/g, "")
                    .replace(",", ".");
                  const price = parseFloat(priceText);
                  if (!isNaN(price) && price > 0) {
                    product.price = price;
                    break;
                  }
                }
              }

              // Extract image
              const imgEl = el.querySelector("img");
              if (imgEl) {
                product.imageUrl =
                  imgEl.src || imgEl.dataset.src || imgEl.dataset.lazySrc;
              }

              // Extract product URL
              const linkEl = el.querySelector("a");
              if (linkEl) {
                product.productUrl = linkEl.href;
              }

              // Generate ID from URL or name
              if (product.productUrl) {
                const urlParts = product.productUrl.split("/");
                product.id =
                  urlParts[urlParts.length - 1] ||
                  "carrefour_" + Math.random().toString(36).substr(2, 9);
              } else {
                product.id =
                  "carrefour_" + Math.random().toString(36).substr(2, 9);
              }

              if (product.name && product.price) {
                products.push(product);
              }
            } catch (err) {
              console.error("Error extracting product:", err);
            }
          });

          return products;
        });

        products.push(...extractedProducts);
        console.log(
          `✅ Found ${extractedProducts.length} products for "${searchTerm}"`,
        );
      }
    } catch (error) {
      console.error(`❌ Error searching for ${searchTerm}:`, error.message);
      this.stats.errors.push({
        type: "search",
        query: searchTerm,
        message: error.message,
      });
    } finally {
      await page.close();
    }

    return products;
  }

  async scrapeBySearch() {
    // Common Belgian grocery search terms
    const searchTerms = [
      "melk",
      "brood",
      "kaas",
      "vlees",
      "kip",
      "vis",
      "groenten",
      "fruit",
      "aardappelen",
      "tomaten",
      "pasta",
      "rijst",
      "olie",
      "boter",
      "eieren",
      "yoghurt",
      "water",
      "bier",
      "wijn",
      "koffie",
      "thee",
      "suiker",
      "bloem",
      "chips",
      "koekjes",
      "chocolade",
      "snoep",
      "frisdrank",
      "sap",
      "shampoo",
      "zeep",
      "tandpasta",
      "wc papier",
      "wasmiddel",
      "afwasmiddel",
      "schoonmaakmiddel",
    ];

    console.log(`📝 Will search for ${searchTerms.length} product categories`);

    for (const term of searchTerms) {
      await this.delay(SCRAPE_DELAY);
      const products = await this.searchProducts(term);
      await this.saveProducts(products);
    }
  }

  async scrapeWithDirectUrls() {
    const page = await this.createPage();

    try {
      // Try online shopping URL
      console.log("🛒 Trying online shopping portal...");
      await page.goto("https://drive.carrefour.be/nl", {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      await this.handleInitialSetup(page);

      // Check if we need to select a store or delivery method
      const storeSelector = await page.$(
        'button:has-text("Kies winkel"), a:has-text("Kies winkel")',
      );
      if (storeSelector) {
        console.log(
          "📍 Store selection required - this would need ZIP code input",
        );
        // This would require user input for ZIP code
      }

      // Take screenshot to see current state
      await page.screenshot({ path: "carrefour-drive.png" });
      console.log("📸 Screenshot saved as carrefour-drive.png");
    } catch (error) {
      console.error("❌ Error with direct URL approach:", error.message);
    } finally {
      await page.close();
    }
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

      console.log("\n📋 Starting product search scraping...");
      console.log("This will search for common product categories.\n");

      // Use search-based scraping as the main approach
      await this.scrapeBySearch();

      // Optionally try the drive portal
      // await this.scrapeWithDirectUrls();

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
      });

      console.log("\n✅ Scraping completed!");
      console.log(`📊 Stats:
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
