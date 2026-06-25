"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { KaliToolsLedger } from "@/components/kali-tools-ledger";
import { SlashMark } from "@/components/slash-mark";
import type { KaliCategory } from "@/lib/kali-tools";
import type { ToolListItem } from "@/lib/tools-registry";

interface MetasploitSection {
  href: string;
  overview: string;
  modules: { type: string; description: string }[];
  interfaces: { name: string; description: string }[];
}

type SectionFilter = "all" | "popular" | "metasploit" | "archives" | "kali";
type ToolsFilter = SectionFilter | string;

const SECTION_FILTERS: { id: SectionFilter; label: string; sectionId?: string }[] = [
  { id: "all", label: "All" },
  { id: "popular", label: "Popular", sectionId: "tools-popular" },
  { id: "metasploit", label: "Metasploit", sectionId: "tools-metasploit" },
  { id: "archives", label: "Archives", sectionId: "tools-archives" },
  { id: "kali", label: "Kali", sectionId: "tools-kali" },
];

function isSectionFilter(filter: ToolsFilter): filter is SectionFilter {
  return SECTION_FILTERS.some((entry) => entry.id === filter);
}

function toolMatchesSearch(tool: ToolListItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    tool.name.toLowerCase().includes(q) ||
    tool.slug.toLowerCase().includes(q) ||
    tool.description.toLowerCase().includes(q) ||
    (tool.tags?.some((tag) => tag.toLowerCase().includes(q)) ?? false)
  );
}

function toolMatchesTag(tool: ToolListItem, tag: string): boolean {
  return (
    tool.tags?.some((entry) => entry.toLowerCase() === tag.toLowerCase()) ??
    false
  );
}

function metasploitMatchesSearch(
  section: MetasploitSection,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if ("metasploit".includes(q)) return true;
  if (section.overview.toLowerCase().includes(q)) return true;
  return (
    section.modules.some(
      (mod) =>
        mod.type.toLowerCase().includes(q) ||
        mod.description.toLowerCase().includes(q),
    ) ||
    section.interfaces.some(
      (iface) =>
        iface.name.toLowerCase().includes(q) ||
        iface.description.toLowerCase().includes(q),
    )
  );
}

function kaliMatchesSearch(categories: KaliCategory[], query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return categories.some((cat) =>
    cat.tools.some(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.slug.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q),
    ),
  );
}

function filterRegistryTools(
  tools: ToolListItem[],
  query: string,
  categoryFilter: ToolsFilter,
  section: "popular" | "archives",
): ToolListItem[] {
  return tools.filter((tool) => {
    if (!toolMatchesSearch(tool, query)) return false;
    if (categoryFilter === "all") return true;
    if (isSectionFilter(categoryFilter)) {
      if (categoryFilter === section) return true;
      if (categoryFilter === "metasploit" || categoryFilter === "kali") {
        return false;
      }
      return categoryFilter === "all";
    }
    return toolMatchesTag(tool, categoryFilter);
  });
}

function ToolGrid({ tools }: { tools: ToolListItem[] }) {
  return (
    <div className="red-grid-2">
      {tools.map((tool) => (
        <Link
          key={tool.slug}
          href={`/tools/${tool.slug}`}
          className="group block bg-black p-6 transition-colors duration-150 hover:bg-[rgb(173_0_19/0.14)] md:p-8"
        >
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-display text-2xl text-white group-hover:text-red group-active:text-red">
              {tool.name}
            </span>
            {tool.tags && (
              <ul className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <li key={tag} className="meta">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="font-serif text-sm leading-relaxed text-white/75 md:text-base">
            {tool.description}
          </p>
        </Link>
      ))}
    </div>
  );
}

export function ToolsIndex({
  popularTools,
  externalTools,
  kaliCategories,
  kaliToolCount,
  metasploitSection,
}: {
  popularTools: ToolListItem[];
  externalTools: ToolListItem[];
  kaliCategories: KaliCategory[];
  kaliToolCount: number;
  metasploitSection: MetasploitSection;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ToolsFilter>("all");

  const tagFilters = useMemo(() => {
    const tags = new Set<string>();
    for (const tool of popularTools) {
      for (const tag of tool.tags ?? []) tags.add(tag.toLowerCase());
    }
    return Array.from(tags).sort();
  }, [popularTools]);

  const filteredPopular = useMemo(
    () =>
      filterRegistryTools(popularTools, searchQuery, categoryFilter, "popular"),
    [popularTools, searchQuery, categoryFilter],
  );

  const filteredArchives = useMemo(
    () =>
      filterRegistryTools(
        externalTools,
        searchQuery,
        categoryFilter,
        "archives",
      ),
    [externalTools, searchQuery, categoryFilter],
  );

  const filteredKaliCount = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return kaliToolCount;
    return kaliCategories.reduce(
      (sum, cat) =>
        sum +
        cat.tools.filter(
          (tool) =>
            tool.name.toLowerCase().includes(q) ||
            tool.slug.toLowerCase().includes(q) ||
            tool.description.toLowerCase().includes(q),
        ).length,
      0,
    );
  }, [kaliCategories, kaliToolCount, searchQuery]);

  const showMetasploit = useMemo(() => {
    if (
      categoryFilter === "popular" ||
      categoryFilter === "archives" ||
      categoryFilter === "kali"
    ) {
      return false;
    }
    if (!isSectionFilter(categoryFilter) && categoryFilter !== "all") {
      return false;
    }
    if (!metasploitMatchesSearch(metasploitSection, searchQuery)) return false;
    return categoryFilter === "all" || categoryFilter === "metasploit";
  }, [categoryFilter, metasploitSection, searchQuery]);

  const showPopular = useMemo(() => {
    if (categoryFilter === "metasploit" || categoryFilter === "kali") {
      return false;
    }
    if (categoryFilter === "archives") return false;
    if (!isSectionFilter(categoryFilter) && categoryFilter !== "all") {
      return filteredPopular.length > 0;
    }
    if (categoryFilter === "popular") return filteredPopular.length > 0;
    return filteredPopular.length > 0 || searchQuery.trim().length === 0;
  }, [categoryFilter, filteredPopular, searchQuery]);

  const showArchives = useMemo(() => {
    if (
      categoryFilter === "popular" ||
      categoryFilter === "metasploit" ||
      categoryFilter === "kali"
    ) {
      return false;
    }
    if (!isSectionFilter(categoryFilter) && categoryFilter !== "all") {
      return filteredArchives.length > 0;
    }
    if (categoryFilter === "archives") return filteredArchives.length > 0;
    return filteredArchives.length > 0 || searchQuery.trim().length === 0;
  }, [categoryFilter, filteredArchives, searchQuery]);

  const showKali = useMemo(() => {
    if (
      categoryFilter === "popular" ||
      categoryFilter === "archives" ||
      categoryFilter === "metasploit"
    ) {
      return false;
    }
    if (!isSectionFilter(categoryFilter) && categoryFilter !== "all") {
      return false;
    }
    if (
      searchQuery.trim().length > 0 &&
      !kaliMatchesSearch(kaliCategories, searchQuery)
    ) {
      return false;
    }
    if (categoryFilter === "kali") return true;
    return searchQuery.trim().length === 0;
  }, [categoryFilter, kaliCategories, searchQuery]);

  const kaliForceExpanded =
    categoryFilter === "kali" ||
    (searchQuery.trim().length > 0 && kaliMatchesSearch(kaliCategories, searchQuery));

  const matchCount =
    filteredPopular.length +
    filteredArchives.length +
    filteredKaliCount +
    (showMetasploit ? 1 : 0);

  const hasActiveFilters =
    categoryFilter !== "all" || searchQuery.trim().length > 0;

  const selectFilter = (filter: ToolsFilter, sectionId?: string) => {
    setCategoryFilter(filter);
    if (sectionId) {
      requestAnimationFrame(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const noResults =
    hasActiveFilters &&
    !showPopular &&
    !showMetasploit &&
    !showArchives &&
    !showKali;

  return (
    <>
      <div className="tools-filter-bar sticky top-0 z-20 bg-black">
        <SlashMark rows={3} className="p-4" />

        <div className="ledger-controls px-4 py-4 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="meta mb-3">Directory</p>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filter tools by section or tag"
              >
                {SECTION_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => selectFilter(filter.id, filter.sectionId)}
                    className={`ledger-filter-chip${
                      categoryFilter === filter.id
                        ? " ledger-filter-chip-active"
                        : ""
                    }`}
                    aria-pressed={categoryFilter === filter.id}
                  >
                    {filter.label}
                  </button>
                ))}
                {tagFilters.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => selectFilter(tag)}
                    className={`ledger-filter-chip${
                      categoryFilter === tag ? " ledger-filter-chip-active" : ""
                    }`}
                    aria-pressed={categoryFilter === tag}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full shrink-0 lg:w-72">
              <label className="sr-only" htmlFor="tools-search">
                Search tools
              </label>
              <input
                id="tools-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, slug, description, tag…"
                className="ledger-search"
                spellCheck={false}
              />
            </div>
          </div>

          <p className="meta mt-4">
            {matchCount} match{matchCount === 1 ? "" : "es"}
            {hasActiveFilters ? "" : ` · ${kaliToolCount + popularTools.length + externalTools.length + 1} indexed`}
          </p>
        </div>
      </div>

      {noResults && (
        <p className="meta cell border-x-0 px-6 py-8 md:px-10">
          No tools match filters.
        </p>
      )}

      {showPopular && (
        <section
          id="tools-popular"
          className="cell scroll-mt-24 border-x-0 p-6 md:p-10"
        >
          <p className="meta mb-2">Market</p>
          <h2 className="font-display mb-8 text-5xl leading-none tracking-wide text-white md:text-6xl">
            POPULAR
          </h2>
          <ToolGrid tools={filteredPopular} />
        </section>
      )}

      {showMetasploit && (
        <section
          id="tools-metasploit"
          className="cell scroll-mt-24 border-x-0 p-6 md:p-10"
        >
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <p className="meta">Framework</p>
            <Link href="/tools/metasploit" className="meta hover:text-white">
              → overview
            </Link>
          </div>
          <Link href="/tools/metasploit" className="group mb-8 block">
            <h2 className="font-display text-5xl leading-none tracking-wide text-white group-hover:text-red group-active:text-red md:text-6xl">
              METASPLOIT
            </h2>
          </Link>
          <p className="mb-8 max-w-prose font-serif text-lg leading-relaxed text-white/90">
            {metasploitSection.overview}
          </p>

          <div className="red-grid-2 mb-10">
            {metasploitSection.modules.map((mod) => (
              <div key={mod.type} className="bg-black p-6">
                <p className="meta mb-2">{mod.type}</p>
                <p className="font-serif text-sm leading-relaxed text-white/75">
                  {mod.description}
                </p>
              </div>
            ))}
          </div>

          <p className="meta mb-4">Interfaces</p>
          <dl className="grid border border-red md:grid-cols-2">
            {metasploitSection.interfaces.map((iface) => (
              <div
                key={iface.name}
                className="border-b border-red p-6 md:border-b-0 md:odd:border-r"
              >
                <dt className="font-mono text-sm uppercase tracking-wide text-red">
                  {iface.name}
                </dt>
                <dd className="mt-2 font-serif text-sm leading-relaxed text-white/75">
                  {iface.description}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {showArchives && (
        <section
          id="tools-archives"
          className="cell scroll-mt-24 border-x-0 p-6 md:p-10"
        >
          <p className="meta mb-2">Archives</p>
          <h2 className="font-display mb-8 text-5xl leading-none tracking-wide text-white md:text-6xl">
            Other Sources
          </h2>
          <ToolGrid tools={filteredArchives} />
        </section>
      )}

      {showKali && (
        <div id="tools-kali" className="scroll-mt-24">
          <KaliToolsLedger
            categories={kaliCategories}
            toolCount={kaliToolCount}
            searchQuery={searchQuery}
            forceExpanded={kaliForceExpanded}
          />
        </div>
      )}
    </>
  );
}
