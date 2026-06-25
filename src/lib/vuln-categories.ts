import type { SignalPreview } from "@/lib/post";

export const VULN_FILTERS = ["all", "xss", "rce", "dos", "other"] as const;
export type VulnFilter = (typeof VULN_FILTERS)[number];

export const VULN_FILTER_LABELS: Record<VulnFilter, string> = {
  all: "All",
  xss: "XSS",
  rce: "RCE",
  dos: "DoS",
  other: "Other",
};

const TAG_XSS = new Set(["xss", "stored-xss", "reflected-xss", "dom-xss"]);
const TAG_RCE = new Set([
  "rce",
  "remote-code-execution",
  "code-execution",
  "deserialization",
]);
const TAG_DOS = new Set(["dos", "ddos", "denial-of-service"]);
const TAG_OTHER = new Set([
  "ssrf",
  "csrf",
  "xsrf",
  "auth-bypass",
  "authentication-bypass",
  "zero-day",
  "0day",
  "malware",
  "botnet",
  "stealer",
  "supply-chain",
  "breach",
  "credentials",
  "info-disclosure",
  "information-disclosure",
  "sqli",
  "sql-injection",
  "lfi",
  "rfi",
  "path-traversal",
  "privilege-escalation",
  "privesc",
]);

const TEXT_PATTERNS: Record<Exclude<VulnFilter, "all">, RegExp> = {
  xss: /\bxss\b|cross[- ]site scripting/i,
  rce: /\brce\b|remote code execution|code execution/i,
  dos: /\bdos\b|\bddos\b|denial of service|denial-of-service/i,
  other:
    /\bssrf\b|\bcsrf\b|\bxsrf\b|auth[- ]?bypass|zero[- ]?day|\b0day\b|malware|botnet|stealer|supply[- ]chain|info(?:rmation)?[- ]disclosure|sql injection|\bsqli\b/i,
};

const CVE_PATTERN = /CVE-\d{4}-\d+/gi;

function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim();
}

export function getPostVulnCategories(post: SignalPreview): VulnFilter[] {
  const categories = new Set<Exclude<VulnFilter, "all">>();
  const normalizedTags = post.tags.map(normalizeTag);
  const searchText = `${post.title} ${post.excerpt}`;

  for (const tag of normalizedTags) {
    if (TAG_XSS.has(tag)) categories.add("xss");
    if (TAG_RCE.has(tag)) categories.add("rce");
    if (TAG_DOS.has(tag)) categories.add("dos");
    if (TAG_OTHER.has(tag)) categories.add("other");
  }

  for (const [category, pattern] of Object.entries(TEXT_PATTERNS) as [
    Exclude<VulnFilter, "all">,
    RegExp,
  ][]) {
    if (pattern.test(searchText)) categories.add(category);
  }

  return categories.size > 0 ? [...categories] : [];
}

export function postMatchesVulnFilter(
  post: SignalPreview,
  filter: VulnFilter,
): boolean {
  if (filter === "all") return true;
  return getPostVulnCategories(post).includes(filter);
}

export function postMatchesSearch(
  post: SignalPreview,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    post.title,
    post.excerpt,
    post.tags.join(" "),
    ...(post.title.match(CVE_PATTERN) ?? []),
    ...(post.excerpt.match(CVE_PATTERN) ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}
