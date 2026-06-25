import { ENHANCED_CONTENT } from "./enhanced";
import { ENHANCED_KALI_CONTENT } from "./enhanced-kali";
import { RICH_CONTENT } from "./rich";
import type { ToolContentTier, ToolEnrichment } from "./types";

export type { ToolCommand, ToolContentTier, ToolEnrichment } from "./types";

const ENHANCED_MERGED: Record<string, ToolEnrichment> = {
  ...ENHANCED_CONTENT,
  ...ENHANCED_KALI_CONTENT,
};

const RICH_SLUGS = new Set(Object.keys(RICH_CONTENT));
const ENHANCED_SLUGS = new Set(Object.keys(ENHANCED_MERGED));

export function getToolEnrichment(slug: string): ToolEnrichment | undefined {
  return RICH_CONTENT[slug] ?? ENHANCED_MERGED[slug];
}

export function getContentTier(slug: string): ToolContentTier {
  if (RICH_SLUGS.has(slug)) return "rich";
  if (ENHANCED_SLUGS.has(slug)) return "enhanced";
  return "baseline";
}

export function getContentStats(): {
  rich: number;
  enhanced: number;
  baseline: number;
  total: number;
} {
  const rich = RICH_SLUGS.size;
  const enhanced = ENHANCED_SLUGS.size;
  return { rich, enhanced, baseline: 0, total: 0 };
}

export { ENHANCED_MERGED as ENHANCED_CONTENT, RICH_CONTENT };
