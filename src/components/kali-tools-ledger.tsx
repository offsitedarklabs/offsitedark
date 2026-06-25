"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { KaliCategory } from "@/lib/kali-tools";

function GroupHeader({
  label,
  count,
  expanded,
  onToggle,
  depth = 0,
}: {
  label: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
  depth?: number;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="ledger-group-header"
      style={{ paddingLeft: `calc(1rem + ${depth * 0.75}rem)` }}
      aria-expanded={expanded}
    >
      <span className="ledger-group-chevron" aria-hidden>
        {expanded ? "−" : "+"}
      </span>
      <span className="font-serif text-lg">{label}</span>
      <span className="meta ml-auto shrink-0">{count}</span>
    </button>
  );
}

function ToolEntry({ tool }: { tool: KaliCategory["tools"][number] }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="tool-entry group block border-b border-red px-4 py-4 transition-colors duration-150 hover:bg-[rgb(173_0_19/0.14)] md:px-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-sm uppercase tracking-wide text-white group-hover:text-red group-active:text-red">
          {tool.name}
        </span>
        <span className="meta">{tool.slug}</span>
      </div>
      <p className="mt-2 max-w-prose font-serif text-sm leading-relaxed text-white/70">
        {tool.description}
      </p>
    </Link>
  );
}

export function KaliToolsLedger({
  categories,
  toolCount,
  searchQuery = "",
  forceExpanded = false,
}: {
  categories: KaliCategory[];
  toolCount: number;
  searchQuery?: string;
  forceExpanded?: boolean;
}) {
  const [kaliOpen, setKaliOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;

    return categories
      .map((cat) => ({
        ...cat,
        tools: cat.tools.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.slug.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.tools.length > 0);
  }, [categories, searchQuery]);

  const filteredCount = useMemo(
    () => filteredCategories.reduce((sum, cat) => sum + cat.tools.length, 0),
    [filteredCategories],
  );

  const hasSearch = searchQuery.trim().length > 0;
  const kaliExpanded = forceExpanded || hasSearch ? true : kaliOpen;

  const toggleLetter = (letter: string) => {
    setExpanded((prev) => ({ ...prev, [letter]: !prev[letter] }));
  };

  return (
    <div className="cell border-x-0">
      <GroupHeader
        label="Kali Linux"
        count={hasSearch ? filteredCount : toolCount}
        expanded={kaliExpanded}
        onToggle={() => setKaliOpen((v) => !v)}
      />

      {kaliExpanded && (
        <div className="border-b border-red">
          <div className="border-b border-red px-4 py-4 md:px-8">
            <p className="meta">
              {filteredCount} curated essential{filteredCount === 1 ? "" : "s"}
              {hasSearch ? " matched" : ""} ·{" "}
              <a
                href="https://www.kali.org/tools/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                full index at kali.org
              </a>
            </p>
          </div>

          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => {
              const letterOpen =
                hasSearch || forceExpanded
                  ? true
                  : (expanded[cat.letter] ?? false);
              return (
                <div key={cat.letter}>
                  <GroupHeader
                    label={cat.letter}
                    count={cat.tools.length}
                    expanded={letterOpen}
                    onToggle={() => toggleLetter(cat.letter)}
                    depth={1}
                  />
                  {letterOpen &&
                    cat.tools.map((tool) => (
                      <ToolEntry key={tool.slug} tool={tool} />
                    ))}
                </div>
              );
            })
          ) : (
            <p className="meta px-4 py-8 md:px-8">No tools match filter.</p>
          )}
        </div>
      )}
    </div>
  );
}
