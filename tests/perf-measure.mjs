/* Measure bytes actually transferred on first load (mobile vs desktop). */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const exe = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

const PROFILES = [
  { name: "MOBILE ", vp: { width: 390, height: 844, isMobile: true, hasTouch: true } },
  { name: "DESKTOP", vp: { width: 1440, height: 900 } },
];

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
  args: ["--no-sandbox"],
});

for (const { name, vp } of PROFILES) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.setCacheEnabled(false);
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2" });
  await new Promise((r) => setTimeout(r, 4500)); // let idle-callback fire

  const stats = await page.evaluate(() => {
    const res = performance.getEntriesByType("resource");
    const sum = (f) =>
      Math.round(res.filter(f).reduce((a, r) => a + (r.transferSize || 0), 0) / 1024);
    const nav = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByName("first-contentful-paint")[0];
    return {
      total: sum(() => true) + Math.round((nav?.transferSize || 0) / 1024),
      js: sum((r) => r.name.endsWith(".js")),
      css: sum((r) => r.name.endsWith(".css")),
      font: sum((r) => /\.woff2?/.test(r.name)),
      img: sum((r) => /_next\/image|\.(webp|png|jpg|avif)/.test(r.name)),
      fcp: Math.round(paint?.startTime || 0),
      domReady: Math.round(nav?.domContentLoadedEventEnd || 0),
      requests: res.length,
    };
  });

  console.log(
    `${name} | total ${stats.total}KB | js ${stats.js}KB | css ${stats.css}KB | fonts ${stats.font}KB | img ${stats.img}KB | FCP ${stats.fcp}ms | DOM ${stats.domReady}ms | ${stats.requests} reqs`
  );
  await page.close();
}
await browser.close();
