"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { SlashMark } from "@/components/slash-mark";
import { formatDate } from "@/lib/format";
import {
  GREP_FILTER_LABELS,
  GREP_FILTERS,
  grepMatchesCategoryFilter,
  grepMatchesSearch,
  type GrepFilter,
} from "@/lib/grep-categories";
import type { GrepPreview } from "@/lib/grep";
import {
  getHashSlugSnapshot,
  pushHashSlug,
  replaceHashSlug,
  subscribeHashSlug,
} from "@/lib/hash-slug";

function GrepRow({
  post,
  isActive,
  onSelect,
}: {
  post: GrepPreview;
  isActive?: boolean;
  onSelect?: () => void;
}) {
  const rowClass = `entry-row flex w-full items-baseline justify-between gap-4 px-4 py-5 text-left md:px-8${
    isActive ? " entry-row-active" : ""
  }`;

  const content = (
    <>
      <span className="meta shrink-0">{formatDate(post.date)}</span>
      <span className="flex-1 font-serif text-lg md:text-xl">{post.title}</span>
      <span className="meta hidden shrink-0 sm:inline">{post.author}</span>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={rowClass}
        aria-current={isActive ? "true" : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={`/greps/${post.slug}`} className={rowClass}>
      {content}
    </Link>
  );
}

export function GrepsLedger({ posts }: { posts: GrepPreview[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<GrepFilter>("all");
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
        grepMatchesCategoryFilter(post, categoryFilter) &&
        grepMatchesSearch(post, searchQuery),
    );
  }, [posts, categoryFilter, searchQuery]);

  const activeSlug = useMemo(() => {
    const preferred = hashSlug || posts[0]?.slug || "";
    if (filteredPosts.some((post) => post.slug === preferred)) return preferred;
    return filteredPosts[0]?.slug ?? "";
  }, [filteredPosts, hashSlug, posts]);

  const hasActiveFilters =
    categoryFilter !== "all" || searchQuery.trim().length > 0;

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

  return (
    <div className="grid lg:grid-cols-2">
      <div className="cell border-l-0 border-t-0">
        <SlashMark rows={3} className="p-4" />

        <div className="ledger-controls border-b border-red px-4 py-4 md:px-8">
          <label className="sr-only" htmlFor="greps-search">
            Search greps
          </label>
          <input
            id="greps-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, slug, tags, model…"
            className="ledger-search"
            spellCheck={false}
          />

          <div
            className="mt-4 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by category"
          >
            {GREP_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setCategoryFilter(filter)}
                className={`ledger-filter-chip${
                  categoryFilter === filter ? " ledger-filter-chip-active" : ""
                }`}
                aria-pressed={categoryFilter === filter}
              >
                {GREP_FILTER_LABELS[filter]}
              </button>
            ))}
          </div>

          <p className="meta mt-4">
            {filteredPosts.length} grep{filteredPosts.length === 1 ? "" : "s"}
            {hasActiveFilters ? " matched" : ""}
          </p>
        </div>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <GrepRow
              key={post.slug}
              post={post}
              isActive={post.slug === activeSlug}
              onSelect={() => selectPost(post.slug)}
            />
          ))
        ) : (
          <p className="meta px-4 py-8 md:px-8">No greps match filters.</p>
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
                  {formatDate(post.date)} · Uploaded by {post.author}
                </p>
                <h2 className="font-display mb-4 text-4xl">{post.title}</h2>
                <p className="signal-preview-excerpt mb-6 max-w-prose font-serif text-lg leading-relaxed">
                  {post.excerpt}
                </p>
                <dl className="mb-6 grid gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-gray">
                  <div>
                    <dt className="inline text-white/40">Model </dt>
                    <dd className="inline">{post.hfModelId}</dd>
                  </div>
                  {post.pipelineTag && (
                    <div>
                      <dt className="inline text-white/40">Pipeline </dt>
                      <dd className="inline">{post.pipelineTag}</dd>
                    </div>
                  )}
                  {post.downloads !== undefined && (
                    <div>
                      <dt className="inline text-white/40">Downloads </dt>
                      <dd className="inline">
                        {post.downloads.toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>
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
                <div className="greps-preview-actions">
                  <Link
                    href={`/greps/${post.slug}`}
                    className="greps-action-link"
                  >
                    → Read entry
                  </Link>
                  <a
                    href={post.hfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="greps-action-link"
                  >
                    → Hugging Face
                  </a>
                </div>
              </article>
            );
          })
        ) : (
          <p className="meta p-8 md:p-12">No greps yet.</p>
        )}
      </div>
    </div>
  );
}
