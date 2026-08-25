/* One-off: render page 1 of a PDF to PNG using pdf.js in headless Edge.
   Usage: node tests/pdf-to-png.mjs <pdf-path> <out-png> */
import puppeteer from "puppeteer-core";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const [, , pdfPath = "public/edu/saylani-certificate.pdf", out = "public/edu/saylani-certificate.png"] =
  process.argv;

const exe = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
].find((p) => existsSync(p));

const b64 = readFileSync(pdfPath).toString("base64");

const browser = await puppeteer.launch({
  executablePath: exe,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setContent(`<canvas id="c"></canvas>
<script type="module">
  import * as pdfjs from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
  const bytes = Uint8Array.from(atob("${b64}"), (ch) => ch.charCodeAt(0));
  const doc = await pdfjs.getDocument({ data: bytes }).promise;
  const p = await doc.getPage(1);
  const viewport = p.getViewport({ scale: 2.5 });
  const canvas = document.getElementById("c");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await p.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
  window.__done = canvas.toDataURL("image/png");
</script>`);
await page.waitForFunction(() => window.__done, { timeout: 60000 });
const dataUrl = await page.evaluate(() => window.__done);
writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
console.log("saved", out);
await browser.close();
