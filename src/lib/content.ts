import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

import { type Category, type GrepCategory } from "./constants";
import type { GrepPost } from "./grep";
import type { ContentType, Post } from "./post";

export type { ContentType, Post } from "./post";
export type { GrepPost } from "./grep";
export { formatDate } from "./format";

const CONTENT_DIR = path.join(process.cwd(), "content");

function normalizeDate(raw: unknown): string {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw.toISOString().slice(0, 10);
  }
  return String(raw ?? "");
}

function normalizeTags(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.map((tag) => String(tag)) : [];
}

function parseDir(dirName: "blog" | "news", defaultType: ContentType): Post[] {
  const dir = path.join(CONTENT_DIR, dirName);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((filename) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(dir, filename), "utf8"),
      );
      return {
        title: String(data.title ?? ""),
        slug: (data.slug as string) ?? filename.replace(/\.mdx?$/, ""),
        date: normalizeDate(data.date),
        type: (data.type as ContentType) ?? defaultType,
        category: data.category as Category,
        tags: normalizeTags(data.tags),
        excerpt: String(data.excerpt ?? ""),
        draft: data.draft as boolean | undefined,
        wip: data.wip as boolean | undefined,
        source: data.source as string | undefined,
        sourceUrl: data.sourceUrl as string | undefined,
        content,
        readingMinutes: Math.ceil(readingTime(content).minutes),
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllPosts() {
  return [...parseDir("blog", "research"), ...parseDir("news", "news")].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getResearchPosts() {
  return parseDir("blog", "research");
}

export function getNewsPosts() {
  return parseDir("news", "news");
}

export function getResearchPostBySlug(slug: string) {
  return getResearchPosts().find((p) => p.slug === slug);
}

export function getNewsPostBySlug(slug: string) {
  return getNewsPosts().find((p) => p.slug === slug);
}

export function getLatestResearch(limit = 5) {
  return getResearchPosts().slice(0, limit);
}

export function getLatestNews(limit = 5) {
  return getNewsPosts().slice(0, limit);
}

function parseGrepDir(): GrepPost[] {
  const dir = path.join(CONTENT_DIR, "greps");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((filename) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(dir, filename), "utf8"),
      );
      const hfModelId = String(data.hfModelId ?? "");
      return {
        title: String(data.title ?? ""),
        slug: (data.slug as string) ?? filename.replace(/\.mdx?$/, ""),
        date: normalizeDate(data.date),
        type: "grep" as const,
        category: data.category as GrepCategory,
        tags: normalizeTags(data.tags),
        excerpt: String(data.excerpt ?? ""),
        draft: data.draft as boolean | undefined,
        author: String(data.author ?? ""),
        hfModelId,
        hfUrl:
          (data.hfUrl as string) ??
          `https://huggingface.co/${hfModelId}`,
        source: (data.source as string) ?? "Hugging Face",
        sourceUrl:
          (data.sourceUrl as string) ??
          `https://huggingface.co/${hfModelId}`,
        downloads: data.downloads as number | undefined,
        likes: data.likes as number | undefined,
        pipelineTag: data.pipelineTag as string | undefined,
        baseModel: data.baseModel as string | undefined,
        content,
        readingMinutes: Math.ceil(readingTime(content).minutes),
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getGrepPosts() {
  return parseGrepDir();
}

export function getGrepPostBySlug(slug: string) {
  return getGrepPosts().find((p) => p.slug === slug);
}
