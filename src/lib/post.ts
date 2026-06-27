import type { Category } from "./constants";

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
  wip?: boolean;
  source?: string;
  sourceUrl?: string;
  content: string;
  readingMinutes: number;
}

export type EntryRowData = Pick<
  Post,
  "date" | "title" | "category" | "slug" | "type" | "wip"
>;

export type SignalPreview = Pick<
  Post,
  "slug" | "title" | "date" | "excerpt" | "source" | "category" | "tags"
>;
