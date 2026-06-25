export type SearchItemKind = "news" | "research" | "grep" | "tool" | "page";

export interface SearchItem {
  kind: SearchItemKind;
  kindLabel: string;
  title: string;
  href: string;
  excerpt?: string;
  /** Lowercase haystack for client-side matching. */
  searchText: string;
}

export function scoreSearchItem(item: SearchItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const title = item.title.toLowerCase();
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (item.excerpt?.toLowerCase().includes(q)) return 40;
  if (item.searchText.includes(q)) return 20;
  return 0;
}

export function filterSearchIndex(
  items: SearchItem[],
  query: string,
  limit = 8,
): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return items
    .map((item) => ({ item, score: scoreSearchItem(item, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map(({ item }) => item);
}
