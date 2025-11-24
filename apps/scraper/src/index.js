import { spawn } from "child_process";
import readline from "readline";

import { ProductDatabase } from "./db/index.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class CarrefourCLI {
  constructor() {
    this.db = new ProductDatabase();
  }

  async showMenu() {
    console.clear();
    console.log("🛒 Carrefour Product Scraper");
    console.log("================================\n");

    const stats = await this.db.getProductStats();
    if (stats.totalProducts > 0) {
      console.log("📊 Database Stats:");
      console.log(`   • Total products: ${stats.totalProducts || 0}`);
      console.log(`   • Categories: ${stats.totalCategories || 0}`);
      console.log(`   • Avg price: €${(stats.avgPrice || 0).toFixed(2)}`);
      console.log(
        `   • Last update: ${stats.lastUpdate ? new Date(stats.lastUpdate).toLocaleString() : "Never"}\n`,
      );
    }

    console.log("Choose an option:");
    console.log("  1. Run full scrape");
    console.log("  2. View recent scrape history");
    console.log("  3. Search products");
    console.log("  4. Export products to JSON");
    console.log("  5. Show categories");
    console.log("  6. Exit\n");
  }

  async runScraper() {
    console.log("\n🚀 Starting scraper...");
    console.log("This may take a while. The scraper will:");
    console.log("  • Navigate to Carrefour.be");
    console.log("  • Collect product categories");
    console.log("  • Scrape products from each category");
    console.log("  • Save products to database\n");

    return new Promise((resolve) => {
      const scraper = spawn("node", ["src/scraper.js"], {
        stdio: "inherit",
        cwd: process.cwd(),
      });

      scraper.on("close", (code) => {
        if (code === 0) {
          console.log("\n✅ Scraping completed successfully!");
        } else {
          console.error(`\n❌ Scraper exited with code ${code}`);
        }
        resolve();
      });

      scraper.on("error", (err) => {
        console.error("❌ Failed to start scraper:", err);
        resolve();
      });
    });
  }

  async showScrapeHistory() {
    const history = await this.db.getRecentScrapes(10);

    console.log("\n📜 Recent Scrape History:");
    console.log("─".repeat(80));

    if (history.length === 0) {
      console.log("No scrape history found.");
    } else {
      history.forEach((scrape, index) => {
        const startTime = new Date(scrape.startedAt).toLocaleString();
        const duration = scrape.completedAt
          ? Math.round(
              (new Date(scrape.completedAt) - new Date(scrape.startedAt)) /
                1000 /
                60,
            )
          : "N/A";

        console.log(`\n${index + 1}. Started: ${startTime}`);
        console.log(`   Status: ${scrape.status}`);
        console.log(`   Duration: ${duration} minutes`);
        console.log(
          `   Products: ${scrape.productsFound || 0} found, ${scrape.productsNew || 0} new, ${scrape.productsUpdated || 0} updated`,
        );

        if (scrape.categories) {
          const categories = JSON.parse(scrape.categories);
          console.log(`   Categories: ${categories.length} scraped`);
        }

        if (scrape.errors) {
          const errors = JSON.parse(scrape.errors);
          if (errors.length > 0) {
            console.log(`   ⚠️ Errors: ${errors.length}`);
          }
        }
      });
    }
    console.log("\n" + "─".repeat(80));
  }

  async searchProducts() {
    const query = await this.prompt("\nEnter search term: ");

    if (!query.trim()) {
      console.log("Search cancelled.");
      return;
    }

    const products = await this.db.searchProducts(query, 20);

    console.log(`\n🔍 Search results for "${query}":`);
    console.log("─".repeat(80));

    if (products.length === 0) {
      console.log("No products found.");
    } else {
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        if (product.brand) console.log(`   Brand: ${product.brand}`);
        if (product.category) console.log(`   Category: ${product.category}`);
        if (product.price)
          console.log(`   Price: €${product.price.toFixed(2)}`);
        if (product.pricePerUnit)
          console.log(`   Unit price: ${product.pricePerUnit}`);
      });
    }
    console.log("\n" + "─".repeat(80));
  }

  async exportProducts() {
    const filename = await this.prompt(
      "\nEnter filename (default: products.json): ",
    );
    const outputFile = filename.trim() || "products.json";

    console.log(`\nExporting products to ${outputFile}...`);

    try {
      const products = await this.db.searchProducts("", 999999); // Get all products

      const fs = await import("fs/promises");
      await fs.writeFile(outputFile, JSON.stringify(products, null, 2));

      console.log(`✅ Exported ${products.length} products to ${outputFile}`);
    } catch (error) {
      console.error("❌ Export failed:", error.message);
    }
  }

  async showCategories() {
    const categories = await this.db.getCategories();

    console.log("\n📂 Product Categories:");
    console.log("─".repeat(80));

    if (categories.length === 0) {
      console.log("No categories found. Run a scrape first.");
    } else {
      categories.forEach((category, index) => {
        console.log(`  ${index + 1}. ${category}`);
      });
    }
    console.log("\n" + "─".repeat(80));
  }

  prompt(question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  async waitForEnter() {
    await this.prompt("\nPress Enter to continue...");
  }

  async run() {
    let running = true;

    while (running) {
      await this.showMenu();
      const choice = await this.prompt("Enter your choice (1-6): ");

      switch (choice.trim()) {
        case "1":
          await this.runScraper();
          await this.waitForEnter();
          break;
        case "2":
          await this.showScrapeHistory();
          await this.waitForEnter();
          break;
        case "3":
          await this.searchProducts();
          await this.waitForEnter();
          break;
        case "4":
          await this.exportProducts();
          await this.waitForEnter();
          break;
        case "5":
          await this.showCategories();
          await this.waitForEnter();
          break;
        case "6":
          running = false;
          console.log("\n👋 Goodbye!");
          break;
        default:
          console.log("\n❌ Invalid choice. Please try again.");
          await this.waitForEnter();
      }
    }

    rl.close();
    process.exit(0);
  }
}

// Run the CLI
const cli = new CarrefourCLI();
cli.run();
