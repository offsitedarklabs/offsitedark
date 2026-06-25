import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const raw = fs.readFileSync(
  path.join(__dirname, "../../agent-tools/69cdde6e-3816-4134-bdb0-4ca66250b700.txt"),
  "utf8",
);

const lines = raw.split("\n");
const categories = [];
let current = null;
const skip = new Set([
  "LIGHT",
  "DARK",
  "All Kali Tools",
  "List all tools",
  ":: Source | :: Package | $ :: Command",
]);

for (const line of lines) {
  const t = line.trim();
  if (!t || skip.has(t)) continue;
  if (t.startsWith("## ")) continue;
  if (t.startsWith("### ")) {
    current = { letter: t.slice(4).trim(), tools: [] };
    categories.push(current);
    continue;
  }
  if (t.startsWith("-")) continue;
  if (current && /^[a-z0-9][a-z0-9._+-]*$/i.test(t)) {
    current.tools.push(t);
  }
}

const unique = new Set();
for (const c of categories) {
  c.tools = c.tools.filter((t) => {
    if (unique.has(t)) return false;
    unique.add(t);
    return true;
  });
}

console.log("categories", categories.length);
console.log("tools", unique.size);
