import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const kali = JSON.parse(
  readFileSync(join(root, "content/tools/kali-curated-slugs.json"), "utf8"),
);

const popular = [
  "nmap", "burp-suite", "wireshark", "bloodhound", "cobalt-strike",
  "hashcat", "impacket", "ghidra", "yara", "volatility", "nuclei", "sqlmap",
];
const links = [
  "church-of-malware", "vx-underground", "sploitus", "project-nightcrawler",
  "kanti-labs", "shannon", "keygraph",
];
const kaliSlugs = kali;
const registry = new Set([...popular, ...links, "metasploit", ...kaliSlugs]);

const richText = readFileSync(join(root, "src/lib/tools-content/rich.ts"), "utf8");
const enhText =
  readFileSync(join(root, "src/lib/tools-content/enhanced.ts"), "utf8") +
  readFileSync(join(root, "src/lib/tools-content/enhanced-kali.ts"), "utf8");
const keyRe = /^  ["']?([a-z0-9_.-]+)["']?: \{/gm;
const richSet = new Set([...richText.matchAll(keyRe)].map((m) => m[1]));
const enhSet = new Set([...enhText.matchAll(keyRe)].map((m) => m[1]));

let richCount = 0;
let enhancedCount = 0;
let baselineCount = 0;

for (const slug of registry) {
  if (richSet.has(slug)) richCount++;
  else if (enhSet.has(slug)) enhancedCount++;
  else baselineCount++;
}

console.log(
  JSON.stringify(
    {
      total: registry.size,
      rich: richCount,
      enhanced: enhancedCount,
      baseline: baselineCount,
      richEntries: richSet.size,
      enhancedEntries: enhSet.size,
    },
    null,
    2,
  ),
);
