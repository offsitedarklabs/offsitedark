import { GREP_CATEGORIES, type GrepCategory } from "./constants";
import type { GrepPreview } from "./grep";

export const GREP_FILTERS = ["all", ...GREP_CATEGORIES] as const;
export type GrepFilter = (typeof GREP_FILTERS)[number];

export const GREP_FILTER_LABELS: Record<GrepFilter, string> = {
  all: "All",
  "recent-upload": "Recent",
  "cyber-llm": "Cyber LLM",
  pentest: "Pentest",
  "code-security": "Code Security",
  "oss-powerhouse": "OSS",
  "malware-ml": "Malware ML",
};

export function grepMatchesCategoryFilter(
  post: GrepPreview,
  filter: GrepFilter,
): boolean {
  if (filter === "all") return true;
  return post.category === (filter as GrepCategory);
}

export function grepMatchesSearch(post: GrepPreview, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    post.title,
    post.slug,
    post.excerpt,
    post.author,
    post.hfModelId,
    post.category,
    post.pipelineTag ?? "",
    post.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}
