/* Diagnostic: hero text visibility — at load, and after scrolling down + back up */
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
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 6000));

await page.screenshot({ path: "tests/shot-hero-load.png" });

// scroll down past the hero, then back to top
await page.evaluate(async () => {
  for (let y = 0; y <= 4000; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 40));
  }
  for (let y = 4000; y >= 0; y -= 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 40));
  }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 1500));

await page.screenshot({ path: "tests/shot-hero-return.png" });
console.log("saved load + return shots");
await browser.close();
