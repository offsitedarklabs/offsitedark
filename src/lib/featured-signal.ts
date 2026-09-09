import { getNewsPosts } from "./content";
import type { Post } from "./post";

const RECENT_WINDOW_DAYS = 14;
const CANDIDATE_CAP = 12;
const MS_PER_DAY = 86_400_000;

function haystack(post: Post): string {
  return `${post.title}\n${post.excerpt}\n${post.tags.join(" ")}\n${post.content.slice(0, 4000)}`.toLowerCase();
}

function interestScore(post: Post, now: number): number {
  const posted = Date.parse(post.date);
  const ageDays = Number.isNaN(posted)
    ? RECENT_WINDOW_DAYS
    : Math.max(0, (now - posted) / MS_PER_DAY);

  const recency = Math.max(0, 42 * (1 - ageDays / RECENT_WINDOW_DAYS));
  const text = haystack(post);
  let interest = Math.min(post.readingMinutes, 18) * 1.6;

  if (/zero[- ]?day|\b0day\b/.test(text)) interest += 16;
  if (/\bkev\b|known exploited/.test(text)) interest += 14;
  if (/in the wild|actively exploited/.test(text)) interest += 12;
  if (/supply[- ]chain/.test(text)) interest += 12;
  if (/\bbreach\b|\bleak(ed|s)?\b/.test(text)) interest += 10;
  if (/\bprivacy\b|\bsurveillance\b/.test(text)) interest += 8;
  if (/\brce\b|remote code/.test(text)) interest += 8;
  if (/cvss[^0-9]{0,8}(9|10)/.test(text) || /\bcritical\b/.test(text)) interest += 8;
  if (/nation[- ]state|\bapt\b/.test(text)) interest += 8;
  if (post.category === "ai") interest += 6;
  if (!/cve-\d{4}-\d+/i.test(post.title)) interest += 10;
  if (post.source && !/sploitus|exploitarium/i.test(post.source)) interest += 4;
  if (/exploitarium|poc collection/i.test(`${post.title} ${post.slug}`)) {
    interest -= 22;
  }

  return recency + interest;
}

export function getFeaturedNewsSignal(): Post | undefined {
  const posts = getNewsPosts();
  if (posts.length === 0) return undefined;

  const now = Date.now();
  const windowStart = now - RECENT_WINDOW_DAYS * MS_PER_DAY;
  const recent = posts.filter((post) => {
    const posted = Date.parse(post.date);
    return !Number.isNaN(posted) && posted >= windowStart;
  });
  const candidates = (recent.length > 0 ? recent : posts).slice(0, CANDIDATE_CAP);

  return [...candidates].sort((a, b) => {
    const delta = interestScore(b, now) - interestScore(a, now);
    if (delta !== 0) return delta;
    return Date.parse(b.date) - Date.parse(a.date);
  })[0];
}

function clipAtSentence(text: string, max: number): string {
  const slice = text.slice(0, max);
  const breakAt = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf(".\n"),
    slice.lastIndexOf("? "),
    slice.lastIndexOf("! "),
  );
  if (breakAt > max * 0.45) return slice.slice(0, breakAt + 1).trim();
  return `${slice.trimEnd()}…`;
}

export function getSignalPreviewMarkdown(content: string, maxChars = 720): string {
  const body = content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim()
    .replace(/^##[^\n]*\n+/, "");
  const chunks: string[] = [];
  let chars = 0;

  for (const part of body.split(/\n{2,}/)) {
    const block = part.trim();
    if (!block) continue;
    if (block.startsWith("|") || block.startsWith("```")) continue;
    if (/^#{1,6}\s/.test(block)) break;

    const remaining = maxChars - chars;
    if (remaining <= 80) break;

    const clipped =
      block.length > remaining ? clipAtSentence(block, remaining) : block;
    if (!clipped) break;

    chunks.push(clipped);
    chars += clipped.length;
    if (chunks.length >= 2 || chars >= maxChars) break;
  }

  return chunks.join("\n\n");
}
