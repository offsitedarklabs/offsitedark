import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const newsDir = join(process.cwd(), "content", "news");

function stripBold(text) {
  let prev;
  let out = text;
  do {
    prev = out;
    out = out.replace(/\*\*([^*]+)\*\*/g, "$1");
  } while (out !== prev);
  return out;
}

let edited = 0;
let totalBoldRemoved = 0;

for (const file of readdirSync(newsDir).filter((f) => f.endsWith(".md"))) {
  const path = join(newsDir, file);
  const original = readFileSync(path, "utf8");
  const boldCount = (original.match(/\*\*/g) || []).length / 2;
  const normalized = stripBold(original);

  if (normalized !== original) {
    writeFileSync(path, normalized, "utf8");
    edited++;
    totalBoldRemoved += boldCount;
    console.log(`${file}: removed ~${boldCount} bold spans`);
  }
}

console.log(`\nEdited ${edited} files, ~${totalBoldRemoved} bold spans removed.`);
