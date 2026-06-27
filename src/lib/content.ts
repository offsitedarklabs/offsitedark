import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

import { CATEGORIES, type Category } from "./constants";

export type ContentType = "research" | "news";

export interface Post {
  title: string;
  slug: string;
  date: string;
  type: ContentType;
  category: Category;
  tags: string[];
  excerpt: string;
  draft?: boolean;
  source?: string;
  sourceUrl?: string;
  content: string;
  readingMinutes: number;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

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
        title: data.title as string,
        slug: (data.slug as string) ?? filename.replace(/\.mdx?$/, ""),
        date: data.date as string,
        type: (data.type as ContentType) ?? defaultType,
        category: data.category as Category,
        tags: (data.tags as string[]) ?? [],
        excerpt: data.excerpt as string,
        draft: data.draft as boolean | undefined,
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

export function getPostBySlug(slug: string) {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getLatestResearch(limit = 5) {
  return getResearchPosts().slice(0, limit);
}

export function getLatestNews(limit = 5) {
  return getNewsPosts().slice(0, limit);
}

export function getAllCategories() {
  const used = new Set(getAllPosts().map((p) => p.category));
  return CATEGORIES.filter((c) => used.has(c));
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
