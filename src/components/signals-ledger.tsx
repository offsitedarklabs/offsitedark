"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { EntryRow } from "@/components/entry-row";
import { SlashMark } from "@/components/slash-mark";
import { formatDate } from "@/lib/format";
import {
  getHashSlugSnapshot,
  pushHashSlug,
  replaceHashSlug,
  subscribeHashSlug,
} from "@/lib/hash-slug";
import type { SignalPreview } from "@/lib/post";
import {
  collectPostsInGroup,
  groupSignalsByDate,
  type LedgerGroup,
} from "@/lib/signals-grouping";
import {
  postMatchesSearch,
  postMatchesVulnFilter,
  VULN_FILTER_LABELS,
  VULN_FILTERS,
  type VulnFilter,
} from "@/lib/vuln-categories";

function LedgerGroupHeader({
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

function LedgerPostList({
  posts,
  selectedSlug,
  onSelect,
}: {
  posts: SignalPreview[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <>
      {posts.map((post) => (
        <EntryRow
          key={post.slug}
          post={{ ...post, type: "news" as const }}
          isActive={post.slug === selectedSlug}
          onSelect={() => onSelect(post.slug)}
        />
      ))}
    </>
  );
}

function LedgerGroups({
  groups,
  expanded,
  selectedSlug,
  onSelect,
  onToggle,
  depth = 0,
}: {
  groups: LedgerGroup[];
  expanded: Record<string, boolean>;
  selectedSlug: string;
  onSelect: (slug: string) => void;
  onToggle: (key: string) => void;
  depth?: number;
}) {
  return (
    <>
      {groups.map((group) => {
        if (group.kind === "current-month") {
          return (
            <LedgerPostList
              key="current-month"
              posts={group.posts}
              selectedSlug={selectedSlug}
              onSelect={onSelect}
            />
          );
        }

        if (group.kind === "month") {
          const isOpen = expanded[group.key] ?? false;
          return (
            <div key={group.key}>
              <LedgerGroupHeader
                label={group.label}
                count={group.posts.length}
                expanded={isOpen}
                onToggle={() => onToggle(group.key)}
                depth={depth}
              />
              {isOpen && (
                <LedgerPostList
                  posts={group.posts}
                  selectedSlug={selectedSlug}
                  onSelect={onSelect}
                />
              )}
            </div>
          );
        }

        const yearOpen = expanded[group.key] ?? false;
        return (
          <div key={group.key}>
            <LedgerGroupHeader
              label={group.label}
              count={collectPostsInGroup(group).length}
              expanded={yearOpen}
              onToggle={() => onToggle(group.key)}
              depth={depth}
            />
            {yearOpen && (
              <LedgerGroups
                groups={group.months}
                expanded={expanded}
                selectedSlug={selectedSlug}
                onSelect={onSelect}
                onToggle={onToggle}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

function collectGroupKeys(groups: LedgerGroup[]): Record<string, boolean> {
  const keys: Record<string, boolean> = {};
  for (const group of groups) {
    if (group.kind === "month" || group.kind === "year") {
      keys[group.key] = true;
    }
    if (group.kind === "year") {
      for (const month of group.months) keys[month.key] = true;
    }
  }
  return keys;
}

export function SignalsLedger({ posts }: { posts: SignalPreview[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [vulnFilter, setVulnFilter] = useState<VulnFilter>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const skipScrollRef = useRef(true);

  const postSlugs = useMemo(
    () => new Set(posts.map((post) => post.slug)),
    [posts],
  );

  const hashSlug = useSyncExternalStore(
    (onStoreChange) => subscribeHashSlug(postSlugs, onStoreChange),
    () => getHashSlugSnapshot(postSlugs),
    () => "",
  );

  const filteredPosts = useMemo(() => {
    return posts.filter(
      (post) =>
        postMatchesVulnFilter(post, vulnFilter) &&
        postMatchesSearch(post, searchQuery),
    );
  }, [posts, vulnFilter, searchQuery]);

  const ledgerGroups = useMemo(
    () => groupSignalsByDate(filteredPosts),
    [filteredPosts],
  );

  const activeSlug = useMemo(() => {
    const preferred = hashSlug || posts[0]?.slug || "";
    if (filteredPosts.some((post) => post.slug === preferred)) return preferred;
    return filteredPosts[0]?.slug ?? "";
  }, [filteredPosts, hashSlug, posts]);

  const isFiltering =
    vulnFilter !== "all" || searchQuery.trim().length > 0;

  const filterExpanded = useMemo(
    () => collectGroupKeys(ledgerGroups),
    [ledgerGroups],
  );

  const displayExpanded = isFiltering ? filterExpanded : expanded;

  const hasActiveFilters = isFiltering;

  useEffect(() => {
    if (!activeSlug || !hashSlug || hashSlug === activeSlug) return;
    replaceHashSlug(activeSlug);
  }, [activeSlug, hashSlug]);

  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    document
      .getElementById(activeSlug)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeSlug]);

  const selectPost = (slug: string) => {
    pushHashSlug(slug);
  };

  const toggleGroup = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid lg:grid-cols-2">
      <div className="cell border-l-0 border-t-0">
        <SlashMark rows={3} className="p-4" />

        <div className="ledger-controls border-b border-red px-4 py-4 md:px-8">
          <label className="sr-only" htmlFor="signals-search">
            Search signals
          </label>
          <input
            id="signals-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, excerpt, tags, CVE…"
            className="ledger-search"
            spellCheck={false}
          />

          <div
            className="mt-4 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by vulnerability type"
          >
            {VULN_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setVulnFilter(filter)}
                className={`ledger-filter-chip${
                  vulnFilter === filter ? " ledger-filter-chip-active" : ""
                }`}
                aria-pressed={vulnFilter === filter}
              >
                {VULN_FILTER_LABELS[filter]}
              </button>
            ))}
          </div>

          <p className="meta mt-4">
            {filteredPosts.length} signal{filteredPosts.length === 1 ? "" : "s"}
            {hasActiveFilters ? " matched" : ""}
          </p>
        </div>

        {filteredPosts.length > 0 ? (
          <LedgerGroups
            groups={ledgerGroups}
            expanded={displayExpanded}
            selectedSlug={activeSlug}
            onSelect={selectPost}
            onToggle={toggleGroup}
          />
        ) : (
          <p className="meta px-4 py-8 md:px-8">No signals match filters.</p>
        )}
      </div>

      <div className="cell border-r-0 border-t-0">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const isActive = post.slug === activeSlug;
            return (
              <article
                key={post.slug}
                id={post.slug}
                className={`signal-preview scroll-mt-20 relative border-b border-red py-8 pr-8 pl-10 md:py-12 md:pr-12 md:pl-14${
                  isActive ? " signal-preview-active" : ""
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <p className="vertical-label absolute left-2 top-8 text-red md:left-4 md:top-12">
                  {post.category}
                </p>
                <p className="meta mb-4">
                  {formatDate(post.date)}
                  {post.source ? ` · ${post.source}` : ""}
                </p>
                <h2 className="font-display mb-4 text-4xl">{post.title}</h2>
                <p className="signal-preview-excerpt mb-6 max-w-prose font-serif text-lg leading-relaxed">
                  {post.excerpt}
                </p>
                {post.tags.length > 0 && (
                  <ul className="mb-6 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li
                        key={tag}
                        className="font-mono text-[0.65rem] uppercase tracking-widest text-gray"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={`/signals/${post.slug}`}
                  className="ledger-nav-link"
                >
                  → Read signal
                </Link>
              </article>
            );
          })
        ) : (
          <p className="meta p-8 md:p-12">No signals yet.</p>
        )}
      </div>
    </div>
  );
}
