import dotenv from "dotenv";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

dotenv.config();

puppeteer.use(StealthPlugin());

async function testScraper() {
  console.log("🧪 Testing Carrefour scraper...\n");

  const browser = await puppeteer.launch({
    headless: false, // Set to false to see what's happening
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

  try {
    const page = await browser.newPage();

    // Set user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    console.log("1️⃣ Navigating to Carrefour.be...");
    const response = await page.goto("https://www.carrefour.be/nl", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    console.log(`   Response status: ${response.status()}`);
    console.log(`   URL: ${page.url()}\n`);

    // Take a screenshot to see what we're getting
    await page.screenshot({ path: "debug-homepage.png" });
    console.log("   📸 Screenshot saved as debug-homepage.png\n");

    // Wait a bit for the page to fully load
    await new Promise((r) => setTimeout(r, 3000));

    // Check for cookie banner
    console.log("2️⃣ Looking for cookie banner...");
    const cookieSelectors = [
      'button[id*="accept"]',
      'button[class*="accept"]',
      'button:contains("Accepteren")',
      'button:contains("Alles accepteren")',
      "#onetrust-accept-btn-handler",
      ".cookie-accept",
    ];

    let cookieFound = false;
    for (const selector of cookieSelectors) {
      try {
        const button = await page.$(selector);
        if (button) {
          console.log(`   ✅ Found cookie button with selector: ${selector}`);
          await button.click();
          await new Promise((r) => setTimeout(r, 1000));
          cookieFound = true;
          break;
        }
      } catch (e) {
        // Continue trying other selectors
      }
    }

    if (!cookieFound) {
      console.log("   ℹ️ No cookie banner found\n");
    }

    // Debug: Log the page title and check if we're on the right page
    const title = await page.title();
    console.log(`3️⃣ Page title: ${title}\n`);

    // Try to find navigation/category links
    console.log("4️⃣ Looking for category links...");

    // Let's check what's actually on the page
    const pageContent = await page.evaluate(() => {
      const info = {
        links: [],
        images: document.images.length,
        forms: document.forms.length,
      };

      // Get all links
      document.querySelectorAll("a").forEach((link) => {
        if (link.href && link.textContent.trim()) {
          info.links.push({
            text: link.textContent.trim().substring(0, 50),
            href: link.href,
            classes: link.className,
          });
        }
      });

      return info;
    });

    console.log(`   Found ${pageContent.links.length} links`);
    console.log(`   Found ${pageContent.images} images`);
    console.log(`   Found ${pageContent.forms} forms\n`);

    // Show first 10 links to understand the structure
    console.log("5️⃣ Sample links found:");
    pageContent.links.slice(0, 10).forEach((link) => {
      console.log(`   - ${link.text}`);
      console.log(`     ${link.href}`);
    });

    // Try to navigate to a specific category page directly
    console.log("\n6️⃣ Trying direct navigation to a category...");
    await page.goto("https://www.carrefour.be/nl/shop/voeding", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await new Promise((r) => setTimeout(r, 3000));
    await page.screenshot({ path: "debug-category.png" });
    console.log("   📸 Category page screenshot saved as debug-category.png");

    // Check for products on category page
    console.log("\n7️⃣ Looking for products...");
    const products = await page.evaluate(() => {
      const selectors = [
        '[data-testid*="product"]',
        ".product-card",
        ".product-item",
        "article",
        '[class*="product"]',
        '[class*="Product"]',
        'div[class*="tile"]',
      ];

      const results = {};
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          results[selector] = elements.length;
        }
      }

      // Also get any data attributes that might help
      const allElements = document.querySelectorAll("*");
      const dataAttributes = new Set();
      allElements.forEach((el) => {
        for (let attr of el.attributes) {
          if (attr.name.startsWith("data-")) {
            dataAttributes.add(attr.name);
          }
        }
      });

      return {
        selectorCounts: results,
        dataAttributes: Array.from(dataAttributes).slice(0, 20),
        bodyClasses: document.body.className,
      };
    });

    console.log("   Selector matches:");
    Object.entries(products.selectorCounts).forEach(([selector, count]) => {
      console.log(`     ${selector}: ${count} elements`);
    });

    console.log("\n   Data attributes found:");
    products.dataAttributes.forEach((attr) => {
      console.log(`     ${attr}`);
    });

    console.log(`\n   Body classes: ${products.bodyClasses}`);
  } catch (error) {
    console.error("❌ Error during test:", error.message);
    console.error(error.stack);
  } finally {
    console.log("\n🏁 Test complete. Browser will close in 10 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await browser.close();
  }
}

testScraper();
