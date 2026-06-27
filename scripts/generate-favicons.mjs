import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svg = readFileSync(join(root, "public", "favicon.svg"));

await sharp(svg).resize(32, 32).toFile(join(root, "public", "favicon.ico"));
await sharp(svg).resize(180, 180).png().toFile(join(root, "public", "apple-touch-icon.png"));

console.log("Generated public/favicon.ico and public/apple-touch-icon.png");
