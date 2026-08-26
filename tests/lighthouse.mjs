/* Run Lighthouse (mobile + desktop) against the local production server. */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const exe = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const paths = (process.argv[3] || "/").split(",");
mkdirSync(".perf", { recursive: true });

const chrome = await launch({
  chromePath: exe,
  chromeFlags: ["--headless=new", "--no-sandbox"],
});

const RUNS = [
  { name: "mobile", settings: {} },
  {
    name: "desktop",
    settings: {
      formFactor: "desktop",
      screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
      throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
    },
  },
];

for (const path of paths) {
  const url = base + path;
  console.log(`\n### ${url}`);
  for (const { name, settings } of RUNS) {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "seo"],
      ...settings,
    });
    const lhr = result.lhr;
    const slug = path.replace(/\W+/g, "_") || "home";
    writeFileSync(`.perf/${name}${slug}.json`, result.report);

    const a = lhr.audits;
    const ms = (id) => Math.round(a[id]?.numericValue ?? -1);
    console.log(
      `${name.toUpperCase().padEnd(7)} | perf ${Math.round(lhr.categories.performance.score * 100)}` +
        ` | seo ${Math.round((lhr.categories.seo?.score ?? 0) * 100)}` +
        ` | FCP ${ms("first-contentful-paint")}ms | LCP ${ms("largest-contentful-paint")}ms` +
        ` | TBT ${ms("total-blocking-time")}ms | CLS ${(a["cumulative-layout-shift"]?.numericValue ?? -1).toFixed(3)}` +
        ` | SI ${ms("speed-index")}ms`
    );
    const failedSeo = Object.values(a).filter(
      (x) => lhr.categories.seo?.auditRefs.some((r) => r.id === x.id && r.weight > 0) && x.score !== null && x.score < 1
    );
    for (const f of failedSeo) console.log(`        | SEO FAIL: ${f.id} — ${f.title}`);
  }
}

try {
  await chrome.kill();
} catch {
  /* temp-dir cleanup can fail on Windows; the browser is already dead */
}
process.exit(0);
