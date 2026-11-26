export type SeverityBand = "critical" | "high" | "medium" | "low";

export type RecordStatus = "kev" | "not-kev" | "unverified";

export type RecordFacets = {
  cve: string | null;
  score: number | null;
  mixed: boolean;
  band: SeverityBand | null;
  status: RecordStatus | null;
  org: string | null;
};

type FacetInput = {
  title: string;
  excerpt?: string;
  tags?: string[];
  source?: string;
  content?: string;
};

const INDEX_SOURCES = new Set([
  "sploitus",
  "hacker news",
  "vx-underground",
  "nvd",
  "project nightcrawler",
  "church of malware",
]);

const VENDOR_TAGS: Record<string, string> = {
  microsoft: "Microsoft",
  defender: "Microsoft",
  windows: "Microsoft",
  bitlocker: "Microsoft",
  nginx: "NGINX",
  apache: "Apache",
  wordpress: "WordPress",
  joomla: "Joomla",
  oracle: "Oracle",
  kubernetes: "Kubernetes",
  react: "React",
  nextjs: "Next.js",
  gitlab: "GitLab",
  linux: "Linux",
  php: "PHP",
  npm: "npm",
  nodejs: "Node.js",
  chrome: "Chrome",
  github: "GitHub",
  steam: "Steam",
};

const VERSIONED_SCORE =
  /CVSS(?:\s*v)?\s*([34](?:\.\d+)?)\s+(?:base\s+)?(\d{1,2}(?:\.\d+)?)/gi;
const BARE_SCORE = /CVSS(?:\s+base)?\s+(\d{1,2}(?:\.\d+)?)/gi;
const SPOKEN_SCORE =
  /\bscores?\s+(?:it\s+|is\s+)?(\d{1,2}(?:\.\d+)?)(?:\s+and\s+(\d{1,2}(?:\.\d+)?))?/gi;

function bandFor(score: number): SeverityBand {
  if (score >= 9) return "critical";
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
}

function firstCve(text: string): string | null {
  const match = text.match(/CVE-\d{4}-\d{4,}/i);
  return match ? match[0].toUpperCase() : null;
}

function pushScore(found: number[], raw: string | undefined, min = 0) {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > 10) return;
  found.push(value);
}

function isCvssVersion(value: number) {
  return value === 3 || value === 3.0 || value === 3.1 || value === 4 || value === 4.0;
}

function scoresIn(raw: string): number[] {
  const text = raw.replace(/\*\*/g, "");
  const versioned: number[] = [];
  for (const match of text.matchAll(VERSIONED_SCORE)) pushScore(versioned, match[2]);
  if (versioned.length > 0) return versioned;

  const found: number[] = [];
  for (const match of text.matchAll(BARE_SCORE)) {
    const value = Number(match[1]);
    if (isCvssVersion(value)) continue;
    pushScore(found, match[1]);
  }
  for (const match of text.matchAll(SPOKEN_SCORE)) {
    pushScore(found, match[1], 1);
    pushScore(found, match[2], 1);
  }
  return found;
}

function statusFor(text: string, tags: string[]): RecordStatus | null {
  const normalized = text.replace(/\*\*/g, "");
  const tagged = tags.some((tag) => {
    const value = tag.toLowerCase();
    return value === "kev" || value === "cisa-kev";
  });
  const added =
    /\badded\b.{0,48}\bto kev\b|\bkev since\b|\bcisa added\b.{0,60}\bkev\b/i.test(
      normalized,
    );
  const denied =
    /not in (?:the )?(?:cisa )?kev|\bnot kev\b|neither\b.{0,80}\bkev\b/i.test(
      normalized,
    ) ||
    /\bnone (?:of them )?is in (?:the )?(?:cisa )?kev\b/i.test(normalized) ||
    /cisa kev listings were\s+not\b/i.test(normalized) ||
    /\bkev\b.{0,48}\bnot listed\b/i.test(normalized);

  if (tagged || added) return "kev";
  if (denied) return "not-kev";
  if (/unverified/i.test(normalized)) return "unverified";
  return null;
}

function orgFor(source: string | undefined, tags: string[]): string | null {
  const cleaned = source?.trim();
  if (cleaned && !INDEX_SOURCES.has(cleaned.toLowerCase())) return cleaned;
  for (const tag of tags) {
    const vendor = VENDOR_TAGS[tag.toLowerCase()];
    if (vendor) return vendor;
  }
  return null;
}

export function recordFacets(input: FacetInput): RecordFacets {
  const tags = input.tags ?? [];
  const lead = `${input.title}\n${input.excerpt ?? ""}`;
  const body = input.content ?? "";
  const leadScores = scoresIn(lead);
  const scores = leadScores.length > 0 ? leadScores : scoresIn(body);
  const unique = [...new Set(scores)];
  const score = unique.length > 0 ? Math.max(...unique) : null;

  return {
    cve: firstCve(input.title) ?? firstCve(input.excerpt ?? "") ?? firstCve(body),
    score,
    mixed: unique.length > 1,
    band: score == null ? null : bandFor(score),
    status: statusFor(lead, tags) ?? statusFor(body, []),
    org: orgFor(input.source, tags),
  };
}

export function severityLabel(band: SeverityBand): string {
  if (band === "critical") return "Critical";
  if (band === "high") return "High";
  if (band === "medium") return "Medium";
  return "Low";
}
