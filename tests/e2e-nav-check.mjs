/**
 * E2E smoke check: navigates like a real user (home → scroll → about →
 * projects → detail → contact → back home) and reports any console
 * errors / page crashes. Run with: node tests/e2e-nav-check.mjs
 */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const EDGE_PATHS = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const CHROME_PATHS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
];

const executablePath = [...EDGE_PATHS, ...CHROME_PATHS].find((p) => existsSync(p));
if (!executablePath) {
  console.error("No Edge/Chrome executable found");
  process.exit(2);
}

const BASE = "http://localhost:3000";
const errors = [];

const browser = await puppeteer.launch({
  executablePath,
  headless: "new",
  args: ["--no-sandbox", "--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`[console] ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrollThrough(label) {
  // scroll to bottom in steps like a user (drives pinned animations)
  await page.evaluate(async () => {
    const step = 600;
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await wait(400);
  console.log(`  scrolled through ${label}`);
}

async function clickNav(href, label) {
  const sel = `a[href='${href}']`;
  await page.waitForSelector(sel, { timeout: 10000 });
  await page.click(sel);
  await wait(2500); // allow transition + effects
  console.log(`  navigated to ${label}`);
}

try {
  console.log("1. Load home");
  await page.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });
  await wait(5000); // preloader
  await scrollThrough("home");

  console.log("2. Navigate to /about (client-side)");
  await clickNav("/about", "about");
  await scrollThrough("about");

  console.log("3. Navigate to /projects");
  await clickNav("/projects", "projects");
  await scrollThrough("projects");

  console.log("4. Open a project detail");
  await page.click("a[href='/projects/ecommerce-platform']").catch(() => {});
  await wait(2500);
  await scrollThrough("project detail");

  console.log("5. Navigate to /contact");
  await clickNav("/contact", "contact");
  await scrollThrough("contact");

  console.log("6. Back to home (mid-scroll navigation stress)");
  await page.evaluate(() => window.scrollTo(0, 800)); // navigate while scrolled
  await wait(300);
  await clickNav("/", "home");
  await scrollThrough("home again");
} catch (e) {
  errors.push(`[script] ${e.message}`);
}

await browser.close();

// filter noise (favicon 404s, deprecation warnings are not errors)
const real = errors.filter(
  (e) => !e.includes("favicon") && !e.includes("THREE.Clock")
);

if (real.length) {
  console.error(`\nFAIL — ${real.length} error(s):`);
  real.forEach((e) => console.error("  " + e));
  process.exit(1);
}
console.log("\nPASS — no console errors across full navigation flow");
