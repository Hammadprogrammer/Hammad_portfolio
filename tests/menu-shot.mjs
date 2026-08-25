/* Screenshot the mobile drawer menu open state */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const exe = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
  args: ["--no-sandbox"],
  defaultViewport: { width: 375, height: 812, isMobile: true, hasTouch: true },
});
const page = await browser.newPage();
await page.goto("http://localhost:3000/about", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 5500));
await page.tap('button[aria-label="Open menu"]');
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: "tests/m-menu-open.png" });
console.log("saved tests/m-menu-open.png");
await browser.close();
