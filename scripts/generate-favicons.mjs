import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svg = readFileSync(join(root, "public", "favicon.svg"));

const sizes = [
  { size: 16, file: "favicon-16x16.png" },
  { size: 32, file: "favicon.ico" },
  { size: 180, file: "apple-touch-icon.png" },
];

for (const { size, file } of sizes) {
  const out = join(root, "public", file);
  const pipeline = sharp(svg).resize(size, size);
  if (file.endsWith(".ico")) {
    await pipeline.toFile(out);
  } else {
    await pipeline.png().toFile(out);
  }
}

console.log("Generated public/favicon.ico, favicon-16x16.png, and apple-touch-icon.png");
