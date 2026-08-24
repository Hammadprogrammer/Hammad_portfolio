/* Screenshot helper: scrolls to a Y offset and captures the viewport.
   Usage: node tests/e2e-shot.mjs <url-path> <scrollY> <outfile> */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const [, , path = "/", scrollY = "0", out = "tests/shot.png"] = process.argv;

const exe = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
].find((p) => existsSync(p));

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
  args: ["--no-sandbox"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 5000)); // preloader

// scroll down in steps to the target (drives scrub animations naturally)
await page.evaluate(async (target) => {
  for (let y = 0; y <= target; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 40));
  }
  window.scrollTo(0, target);
}, Number(scrollY));
await new Promise((r) => setTimeout(r, 1200));

await page.screenshot({ path: out });
console.log("saved", out, "at scrollY", scrollY);
await browser.close();
