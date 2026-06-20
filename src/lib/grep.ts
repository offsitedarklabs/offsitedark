import type { GrepCategory } from "./constants";

export interface GrepPost {
  title: string;
  slug: string;
  date: string;
  type: "grep";
  category: GrepCategory;
  tags: string[];
  excerpt: string;
  draft?: boolean;
  author: string;
  hfModelId: string;
  hfUrl: string;
  source?: string;
  sourceUrl?: string;
  downloads?: number;
  likes?: number;
  pipelineTag?: string;
  baseModel?: string;
  content: string;
  readingMinutes: number;
}

export type GrepPreview = Pick<
  GrepPost,
  | "slug"
  | "title"
  | "date"
  | "excerpt"
  | "author"
  | "category"
  | "tags"
  | "hfModelId"
  | "hfUrl"
  | "downloads"
  | "likes"
  | "pipelineTag"
>;

export type GrepEntryRowData = Pick<
  GrepPost,
  "date" | "title" | "category" | "slug" | "author"
>;
