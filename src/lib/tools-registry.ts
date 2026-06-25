import { getKaliTools } from "@/lib/kali-tools";
import { getContentTier, getToolEnrichment } from "@/lib/tools-content";
import type { ToolContentTier } from "@/lib/tools-content";
import {
  EXTERNAL_LINKS,
  METASPLOIT_SECTION,
  POPULAR_TOOLS,
} from "@/lib/tools-data";

export type ToolCategory = "popular" | "link" | "kali" | "metasploit";

export interface ToolCommand {
  label: string;
  code: string;
}

export interface RegistryTool {
  slug: string;
  name: string;
  description: string;
  externalHref?: string;
  category: ToolCategory;
  tags?: string[];
  kaliLetter?: string;
  metasploit?: typeof METASPLOIT_SECTION;
  contentTier: ToolContentTier;
  overview?: string[];
  useCases?: string[];
  commands?: ToolCommand[];
  features?: string[];
  defense?: string[];
  related?: string[];
}

type BaseRegistryTool = Omit<RegistryTool, "contentTier">;

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  popular: "Market",
  link: "Archives",
  kali: "Kali Linux",
  metasploit: "Framework",
};

export function getCategoryLabel(category: ToolCategory): string {
  return CATEGORY_LABELS[category];
}

export function slugifyToolName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildRegistry(): Map<string, BaseRegistryTool> {
  const registry = new Map<string, BaseRegistryTool>();

  for (const tool of POPULAR_TOOLS) {
    const slug = slugifyToolName(tool.name);
    registry.set(slug, {
      slug,
      name: tool.name,
      description: tool.description,
      externalHref: tool.href,
      category: "popular",
      tags: tool.tags,
    });
  }

  for (const tool of EXTERNAL_LINKS) {
    const slug = slugifyToolName(tool.name);
    registry.set(slug, {
      slug,
      name: tool.name,
      description: tool.description,
      externalHref: tool.href,
      category: "link",
      tags: tool.tags,
    });
  }

  registry.set("metasploit", {
    slug: "metasploit",
    name: "Metasploit Framework",
    description: METASPLOIT_SECTION.overview,
    externalHref: METASPLOIT_SECTION.href,
    category: "metasploit",
    metasploit: METASPLOIT_SECTION,
  });

  const kali = getKaliTools();
  for (const cat of kali.categories) {
    for (const tool of cat.tools) {
      if (registry.has(tool.slug)) continue;
      registry.set(tool.slug, {
        slug: tool.slug,
        name: tool.name,
        description: tool.description,
        externalHref: tool.url,
        category: "kali",
        kaliLetter: cat.letter,
      });
    }
  }

  return registry;
}

let cachedRegistry: Map<string, BaseRegistryTool> | null = null;

function getRegistry(): Map<string, BaseRegistryTool> {
  cachedRegistry ??= buildRegistry();
  return cachedRegistry;
}

export function getAllToolSlugs(): string[] {
  return Array.from(getRegistry().keys());
}

export function getToolBySlug(slug: string): RegistryTool | undefined {
  const base = getRegistry().get(slug);
  if (!base) return undefined;
  const enrichment = getToolEnrichment(slug);
  return {
    ...base,
    contentTier: getContentTier(slug),
    ...enrichment,
  };
}

export function getToolCount(): number {
  return getRegistry().size;
}

export function getPopularTools(): RegistryTool[] {
  return POPULAR_TOOLS.map(
    (tool) => getToolBySlug(slugifyToolName(tool.name))!,
  );
}

export function getExternalLinkTools(): RegistryTool[] {
  return EXTERNAL_LINKS.map(
    (tool) => getToolBySlug(slugifyToolName(tool.name))!,
  );
}

/** Lightweight listing shape for client-side index views (no enrichment payload). */
export type ToolListItem = Pick<
  RegistryTool,
  "slug" | "name" | "description" | "tags"
>;

export function getPopularToolListItems(): ToolListItem[] {
  return POPULAR_TOOLS.map((tool) => ({
    slug: slugifyToolName(tool.name),
    name: tool.name,
    description: tool.description,
    tags: tool.tags,
  }));
}

export function getExternalToolListItems(): ToolListItem[] {
  return EXTERNAL_LINKS.map((tool) => ({
    slug: slugifyToolName(tool.name),
    name: tool.name,
    description: tool.description,
    tags: tool.tags,
  }));
}

export function getAllToolSearchItems(): ToolListItem[] {
  return Array.from(getRegistry().values()).map((tool) => ({
    slug: tool.slug,
    name: tool.name,
    description: tool.description,
    tags: tool.tags,
  }));
}
