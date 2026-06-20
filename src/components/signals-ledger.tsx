"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { EntryRow } from "@/components/entry-row";
import { SlashMark } from "@/components/slash-mark";
import { formatDate } from "@/lib/format";
import type { SignalPreview } from "@/lib/post";

function resolveSlugFromHash(
  posts: SignalPreview[],
  hash: string,
): string | undefined {
  const slug = hash.replace(/^#/, "");
  return slug && posts.some((p) => p.slug === slug) ? slug : undefined;
}

export function SignalsLedger({ posts }: { posts: SignalPreview[] }) {
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
          <EntryRow
            key={post.slug}
            post={{ ...post, type: "news" as const }}
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
                  href={`/news/${post.slug}`}
                  className="meta hover:text-white"
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
