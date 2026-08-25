/* Mobile responsive audit: screenshots of all pages at a given viewport.
   Usage: node tests/mobile-shots.mjs [width] [height] */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const width = Number(process.argv[2] || 375);
const height = Number(process.argv[3] || 812);

const PAGES = [
  ["/", "home"],
  ["/about", "about"],
  ["/projects", "projects"],
  ["/projects/pearlepp", "detail"],
  ["/contact", "contact"],
];

const exe = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
  args: ["--no-sandbox"],
  defaultViewport: { width, height, isMobile: true, hasTouch: true },
});

for (const [path, name] of PAGES) {
  const page = await browser.newPage();
  await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 5000)); // preloader
  await page.screenshot({ path: `tests/m-${name}-${width}-top.png` });
  await page.evaluate(async () => {
    for (let y = 0; y <= 2400; y += 200) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `tests/m-${name}-${width}-scroll.png` });
  // horizontal overflow check
  const xOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  console.log("saved", name, width, "| x-overflow px:", xOverflow);
  await page.close();
}
await browser.close();
