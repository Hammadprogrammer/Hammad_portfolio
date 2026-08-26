/* Verify text stays visible while scrolling after the deferred-load changes. */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const exe = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

const base = process.argv[2] || "http://localhost:3100";
const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
  args: ["--no-sandbox"],
});

const PAGES = [
  { path: "/", name: "home", steps: 14 },
  { path: "/about", name: "about", steps: 12 },
  { path: "/projects", name: "projects", steps: 8 },
  { path: "/contact", name: "contact", steps: 6 },
];

let failures = 0;

for (const { path, name, steps } of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base + path, { waitUntil: "networkidle2" });

  let sawKeywords = false;

  // trigger first-interaction loaders, wait out preloader
  await page.mouse.move(700, 450);
  await page.mouse.move(720, 470);
  await new Promise((r) => setTimeout(r, 3500));

  for (let i = 0; i <= steps; i++) {
    await page.mouse.wheel({ deltaY: 700 });
    await new Promise((r) => setTimeout(r, 650));

    const check = await page.evaluate(() => {
      // count visible text elements inside viewport
      const els = document.querySelectorAll("h1,h2,h3,p,span");
      let visible = 0;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight || r.width === 0) continue;
        const s = getComputedStyle(el);
        if (s.visibility === "hidden" || parseFloat(s.opacity) < 0.05) continue;
        if ((el.textContent || "").trim().length < 3) continue;
        visible++;
      }
      return { visible, y: Math.round(scrollY) };
    });

    if (check.visible === 0) {
      failures++;
      console.log(`FAIL ${name} step ${i} @y=${check.y}: NO visible text`);
      await page.screenshot({ path: `tests/fail-${name}-${i}.png` });
    }

    // home: the hero keyword layer must appear during the pinned phase
    if (name === "home") {
      const kw = await page.evaluate(() => {
        const els = [...document.querySelectorAll("[data-hero-kw]")];
        return els.some((el) => parseFloat(getComputedStyle(el).opacity) > 0.8);
      });
      if (kw && !sawKeywords) {
        sawKeywords = true;
        console.log(`home: keywords visible at step ${i}`);
      }
    }
  }
  if (name === "home" && !sawKeywords) {
    failures++;
    console.log("FAIL home: keywords (REACT/NEXT.JS/...) never became visible");
  }
  console.log(`${name}: scrolled ${steps} steps — done`);
  await page.close();
}

console.log(failures === 0 ? "ALL PAGES OK — text visible at every scroll step" : `${failures} FAILURES`);
await browser.close();
process.exit(failures === 0 ? 0 : 1);
