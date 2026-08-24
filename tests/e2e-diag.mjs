/* Diagnostic: inspect #stack pin state at a given scrollY */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const scrollY = Number(process.argv[2] || 8000);
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
await new Promise((r) => setTimeout(r, 5000));

await page.evaluate(async (target) => {
  for (let y = 0; y <= target; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 40));
  }
}, scrollY);
await new Promise((r) => setTimeout(r, 1200));

const info = await page.evaluate(() => {
  const stack = document.getElementById("stack");
  const spacer = stack?.closest(".pin-spacer");
  const track = stack?.querySelector("[data-tech]")?.parentElement;
  const header = stack?.querySelector("h2");
  const tile = stack?.querySelector("[data-tech]");
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      top: Math.round(b.top),
      left: Math.round(b.left),
      w: Math.round(b.width),
      h: Math.round(b.height),
      pos: cs.position,
      transform: cs.transform.slice(0, 60),
      opacity: cs.opacity,
      display: cs.display,
    };
  };
  return {
    scrollY: window.scrollY,
    stack: r(stack),
    spacer: spacer ? r(spacer) : "no spacer",
    track: r(track),
    header: r(header),
    firstTile: r(tile),
    tileCount: stack?.querySelectorAll("[data-tech]").length,
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
