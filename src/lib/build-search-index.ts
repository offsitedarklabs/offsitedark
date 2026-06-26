import { NAV, PROJECTS } from "@/lib/constants";
import {
  getGrepPosts,
  getNewsPosts,
  getResearchPosts,
} from "@/lib/content";
import type { SearchItem, SearchItemKind } from "@/lib/search-index";
import { getAllToolSearchItems } from "@/lib/tools-registry";

const KIND_LABELS: Record<SearchItemKind, string> = {
  news: "Signal",
  research: "Research",
  grep: "Grep",
  tool: "Tool",
  page: "Page",
};

function joinSearchText(...parts: (string | undefined)[]): string {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .toLowerCase();
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const post of getNewsPosts()) {
    items.push({
      kind: "news",
      kindLabel: KIND_LABELS.news,
      title: post.title,
      href: `/signals/${post.slug}`,
      excerpt: post.excerpt,
      searchText: joinSearchText(
        post.title,
        post.excerpt,
        post.tags.join(" "),
        post.category,
        post.source,
      ),
    });
  }

  for (const post of getResearchPosts()) {
    items.push({
      kind: "research",
      kindLabel: KIND_LABELS.research,
      title: post.title,
      href: `/research/${post.slug}`,
      excerpt: post.excerpt,
      searchText: joinSearchText(
        post.title,
        post.excerpt,
        post.tags.join(" "),
        post.category,
      ),
    });
  }

  for (const post of getGrepPosts()) {
    items.push({
      kind: "grep",
      kindLabel: KIND_LABELS.grep,
      title: post.title,
      href: `/greps/${post.slug}`,
      excerpt: post.excerpt,
      searchText: joinSearchText(
        post.title,
        post.excerpt,
        post.tags.join(" "),
        post.category,
        post.author,
        post.hfModelId,
        post.pipelineTag,
        post.baseModel,
      ),
    });
  }

  for (const tool of getAllToolSearchItems()) {
    items.push({
      kind: "tool",
      kindLabel: KIND_LABELS.tool,
      title: tool.name,
      href: `/tools/${tool.slug}`,
      excerpt: tool.description,
      searchText: joinSearchText(
        tool.name,
        tool.slug,
        tool.description,
        tool.tags?.join(" "),
      ),
    });
  }

  for (const nav of NAV) {
    if (nav.external) continue;
    items.push({
      kind: "page",
      kindLabel: KIND_LABELS.page,
      title: nav.label,
      href: nav.href,
      searchText: joinSearchText(nav.label, nav.href),
    });
  }

  for (const project of PROJECTS) {
    items.push({
      kind: "page",
      kindLabel: "Project",
      title: project.name,
      href: `/projects#${project.slug}`,
      excerpt: project.description,
      searchText: joinSearchText(
        project.name,
        project.description,
        project.status,
        project.features.join(" "),
      ),
    });
  }

  return items;
}
