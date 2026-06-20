"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { SlashMark } from "@/components/slash-mark";
import { formatDate } from "@/lib/format";
import type { GrepPreview } from "@/lib/grep";

function resolveSlugFromHash(
  posts: GrepPreview[],
  hash: string,
): string | undefined {
  const slug = hash.replace(/^#/, "");
  return slug && posts.some((p) => p.slug === slug) ? slug : undefined;
}

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
  const [selectedSlug, setSelectedSlug] = useState(posts[0]?.slug ?? "");
  const skipScrollRef = useRef(true);

  useEffect(() => {
    const fromHash = resolveSlugFromHash(posts, window.location.hash);
    if (fromHash) setSelectedSlug(fromHash);
  }, [posts]);

  useEffect(() => {
    const onHashChange = () => {
      const fromHash = resolveSlugFromHash(posts, window.location.hash);
      if (fromHash) setSelectedSlug(fromHash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [posts]);

  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    document
      .getElementById(selectedSlug)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedSlug]);

  const selectPost = (slug: string) => {
    setSelectedSlug(slug);
    window.history.replaceState(null, "", `#${slug}`);
  };

  return (
    <div className="grid lg:grid-cols-2">
      <div className="cell border-l-0 border-t-0">
        <SlashMark rows={3} className="p-4" />
        {posts.map((post) => (
          <GrepRow
            key={post.slug}
            post={post}
            isActive={post.slug === selectedSlug}
            onSelect={() => selectPost(post.slug)}
          />
        ))}
      </div>
      <div className="cell border-r-0 border-t-0">
        {posts.length > 0 ? (
          posts.map((post) => {
            const isActive = post.slug === selectedSlug;
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
                      <dd className="inline">{post.downloads.toLocaleString()}</dd>
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
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/greps/${post.slug}`}
                    className="meta hover:text-white"
                  >
                    → Read entry
                  </Link>
                  <a
                    href={post.hfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meta hover:text-white"
                  >
                    → Hugging Face
                  </a>
                </div>
              </article>
            );
          })
        ) : (
          <p className="meta p-8 md:p-12">Greps empty.</p>
        )}
      </div>
    </div>
  );
}
