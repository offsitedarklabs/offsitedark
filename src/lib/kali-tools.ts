import curatedSlugs from "../../content/tools/kali-curated-slugs.json";
import kaliData from "../../content/tools/kali.json";

const CURATED_SLUGS = new Set(curatedSlugs as string[]);

export interface KaliTool {
  slug: string;
  name: string;
  url: string;
  description: string;
}

export interface KaliCategory {
  letter: string;
  tools: KaliTool[];
}

export interface KaliToolsData {
  source: string;
  fetchedAt: string;
  toolCount: number;
  curated?: boolean;
  curatedFrom?: number;
  categories: KaliCategory[];
}

function filterCuratedCategories(categories: KaliCategory[]): KaliCategory[] {
  return categories
    .map((cat) => ({
      ...cat,
      tools: cat.tools.filter((tool) => CURATED_SLUGS.has(tool.slug)),
    }))
    .filter((cat) => cat.tools.length > 0);
}

export function getKaliTools(): KaliToolsData {
  const data = kaliData as KaliToolsData;
  const categories = filterCuratedCategories(data.categories).map((cat) => ({
    ...cat,
    tools: cat.tools.map((tool) => ({
      ...tool,
      description: normalizeDescription(tool),
    })),
  }));
  const toolCount = categories.reduce((n, cat) => n + cat.tools.length, 0);
  return {
    ...data,
    curated: true,
    toolCount,
    categories,
  };
}

function normalizeDescription(tool: KaliTool): string {
  const desc = tool.description.trim();
  if (
    desc.length < 24 ||
    desc.toLowerCase() === tool.name.toLowerCase() ||
    desc.toLowerCase() === tool.slug.toLowerCase()
  ) {
    return `Kali Linux package: ${tool.name}.`;
  }
  return desc;
}
