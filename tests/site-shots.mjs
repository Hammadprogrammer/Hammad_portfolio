/* Capture multiple screenshots of external sites into public/projects/ */
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "node:fs";

const SITES = [
  { slug: "pearlepp", url: "https://www.pearlepp.co.uk/" },
  { slug: "hireclassbuddy", url: "https://hireclassbuddy.com/" },
  { slug: "allexamhelp", url: "https://allexamhelp.com/" },
];

const exe = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

mkdirSync("public/projects", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
  args: ["--no-sandbox"],
  defaultViewport: { width: 1440, height: 900 },
});

for (const { slug, url } of SITES) {
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  } catch {
    console.log("slow load, continuing:", url);
  }
  await new Promise((r) => setTimeout(r, 4000));
  // dismiss possible cookie banners by pressing Escape
  await page.keyboard.press("Escape").catch(() => {});

  const offsets = [0, 900, 2000];
  for (let i = 0; i < offsets.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), offsets[i]);
    await new Promise((r) => setTimeout(r, 1500));
    const out = `public/projects/${slug}-${i + 1}.png`;
    await page.screenshot({ path: out });
    console.log("saved", out);
  }
  await page.close();
}
await browser.close();
