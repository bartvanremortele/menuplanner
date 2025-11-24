import dotenv from "dotenv";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

dotenv.config();

puppeteer.use(StealthPlugin());

async function debugCategories() {
  console.log("🧪 Debugging category extraction...\n");

  const browser = await puppeteer.launch({
    headless: false,
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

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    console.log("1️⃣ Going to Carrefour.be...");
    await page.goto("https://www.carrefour.be/nl", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await new Promise((r) => setTimeout(r, 3000));

    // Handle language selection
    const languageButtons = await page.$$("button");
    for (const button of languageButtons) {
      const text = await button.evaluate((el) => el.textContent);
      if (text && text.includes("Nederlands")) {
        console.log("🌐 Clicking Nederlands...");
        await button.click();
        await new Promise((r) => setTimeout(r, 2000));
        break;
      }
    }

    // Handle cookies
    const allButtons = await page.$$("button");
    for (const button of allButtons) {
      const text = await button.evaluate((el) => el.textContent);
      if (text && (text.includes("aanvaarden") || text.includes("afwijzen"))) {
        console.log("🍪 Handling cookies...");
        await button.click();
        await new Promise((r) => setTimeout(r, 2000));
        break;
      }
    }

    console.log("2️⃣ Looking for category URLs...\n");

    // Debug: Check for data-category-url
    const categoryInfo = await page.evaluate(() => {
      const info = {
        withDataCategoryUrl: [],
        linksWithShop: [],
        allDataAttributes: new Set(),
        navigationLinks: [],
      };

      // Find elements with data-category-url
      const elementsWithCategoryUrl = document.querySelectorAll(
        "[data-category-url]",
      );
      elementsWithCategoryUrl.forEach((el) => {
        info.withDataCategoryUrl.push({
          url: el.getAttribute("data-category-url"),
          text: el.textContent?.trim()?.substring(0, 50),
          tagName: el.tagName,
        });
      });

      // Find links that might be categories
      document.querySelectorAll("a").forEach((link) => {
        const href = link.href;
        if (
          href.includes("/shop/") ||
          href.includes("/category/") ||
          href.includes("/c/")
        ) {
          info.linksWithShop.push({
            url: href,
            text: link.textContent?.trim()?.substring(0, 50),
          });
        }
      });

      // Look for navigation
      const nav = document.querySelector(
        'nav, .navigation, .menu, [class*="navigation"], [class*="menu"]',
      );
      if (nav) {
        nav.querySelectorAll("a").forEach((link) => {
          if (link.href && !link.href.includes("#")) {
            info.navigationLinks.push({
              url: link.href,
              text: link.textContent?.trim()?.substring(0, 50),
            });
          }
        });
      }

      // Collect all data attributes
      document.querySelectorAll("*").forEach((el) => {
        for (let attr of el.attributes) {
          if (attr.name.startsWith("data-")) {
            info.allDataAttributes.add(attr.name);
          }
        }
      });

      info.allDataAttributes = Array.from(info.allDataAttributes).filter(
        (attr) =>
          attr.includes("category") ||
          attr.includes("url") ||
          attr.includes("link"),
      );

      return info;
    });

    console.log("📊 Results:");
    console.log(
      `\nElements with data-category-url: ${categoryInfo.withDataCategoryUrl.length}`,
    );
    if (categoryInfo.withDataCategoryUrl.length > 0) {
      console.log("Sample:");
      categoryInfo.withDataCategoryUrl.slice(0, 5).forEach((cat) => {
        console.log(`  - ${cat.tagName}: ${cat.text} -> ${cat.url}`);
      });
    }

    console.log(
      `\nLinks with /shop/ or /category/: ${categoryInfo.linksWithShop.length}`,
    );
    if (categoryInfo.linksWithShop.length > 0) {
      console.log("Sample:");
      categoryInfo.linksWithShop.slice(0, 5).forEach((link) => {
        console.log(`  - ${link.text} -> ${link.url}`);
      });
    }

    console.log(`\nNavigation links: ${categoryInfo.navigationLinks.length}`);
    if (categoryInfo.navigationLinks.length > 0) {
      console.log("Sample:");
      categoryInfo.navigationLinks.slice(0, 10).forEach((link) => {
        console.log(`  - ${link.text} -> ${link.url}`);
      });
    }

    console.log("\nRelevant data attributes found:");
    categoryInfo.allDataAttributes.forEach((attr) => {
      console.log(`  - ${attr}`);
    });

    // Check current page state
    const pageState = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        hasProductsMenu:
          document.querySelector(
            '[href*="Producten"], button:has-text("Producten")',
          ) !== null,
      };
    });

    console.log("\n📍 Page state:");
    console.log(`  URL: ${pageState.url}`);
    console.log(`  Title: ${pageState.title}`);
    console.log(`  Has Products menu: ${pageState.hasProductsMenu}`);

    // Try clicking on Products menu if it exists
    if (pageState.hasProductsMenu) {
      console.log("\n3️⃣ Trying to open Products menu...");
      await page.evaluate(() => {
        const productsLink = document.querySelector(
          '[href*="Producten"], button:has-text("Producten")',
        );
        if (productsLink) productsLink.click();
      });

      await new Promise((r) => setTimeout(r, 2000));

      // Check again for categories
      const afterClick = await page.evaluate(() => {
        const categories = [];
        document.querySelectorAll("[data-category-url]").forEach((el) => {
          categories.push({
            url: el.getAttribute("data-category-url"),
            text: el.textContent?.trim(),
          });
        });
        return categories;
      });

      console.log(
        `\nAfter clicking Products: ${afterClick.length} categories found`,
      );
      if (afterClick.length > 0) {
        console.log("Categories:");
        afterClick.forEach((cat) => {
          console.log(`  - ${cat.text}: ${cat.url}`);
        });
      }
    }

    await page.screenshot({
      path: "debug-homepage-categories.png",
      fullPage: true,
    });
    console.log("\n📸 Screenshot saved as debug-homepage-categories.png");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    console.log(
      "\n🏁 Keeping browser open for inspection. Press Ctrl+C to exit.",
    );
    await new Promise(() => {});
  }
}

debugCategories();
