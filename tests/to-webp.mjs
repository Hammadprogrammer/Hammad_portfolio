/* Convert public images to WebP (resized to a sane max width) and report savings. */
import { readdirSync, statSync, unlinkSync } from "node:fs";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const DIRS = ["public/projects", "public/edu"];
const MAX_WIDTH = 1600;
const QUALITY = 80;

let before = 0;
let after = 0;

for (const dir of DIRS) {
  for (const file of readdirSync(dir)) {
    const ext = extname(file).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;

    const src = join(dir, file);
    const out = join(dir, `${basename(file, ext)}.webp`);
    const srcSize = statSync(src).size;

    await sharp(src)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(out);

    const outSize = statSync(out).size;
    before += srcSize;
    after += outSize;
    unlinkSync(src);
    console.log(
      `${file} → ${basename(out)}  ${Math.round(srcSize / 1024)}KB → ${Math.round(
        outSize / 1024
      )}KB`
    );
  }
}

console.log(
  `\nTOTAL: ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB  (${Math.round(
    (1 - after / before) * 100
  )}% smaller)`
);
