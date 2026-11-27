import Link from "next/link";

import { Markdown } from "@/components/markdown";
import { SeverityMark } from "@/components/severity-mark";
import { formatDate } from "@/lib/format";
import { getSignalPreviewMarkdown } from "@/lib/featured-signal";
import { recordFacets } from "@/lib/record-facets";
import type { Post } from "@/lib/post";

export function FeaturedSignal({ post }: { post: Post }) {
  const href = `/signals/${post.slug}`;
  const preview = getSignalPreviewMarkdown(post.content);
  const facets = recordFacets(post);

  return (
    <section aria-labelledby="featured-signal-title" className="featured-signal">
      <div className="grid items-stretch md:grid-cols-[1.2fr_1fr]">
        <div className="featured-signal-lead cell relative min-w-0 overflow-hidden border-l-0 border-t-0 p-6 pl-12 md:p-10 md:pl-14">
          <p className="vertical-label absolute left-2 top-6 text-red md:left-4 md:top-10">
            Featured
          </p>
          <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="meta">
              {formatDate(post.date)}
              {facets.org ? ` · ${facets.org}` : post.source ? ` · ${post.source}` : ""}
              {` · ${post.readingMinutes} min`}
            </p>
            <SeverityMark facets={facets} />
          </div>
          <h2
            id="featured-signal-title"
            className="break-words font-display text-[clamp(2.25rem,6.2vw,5.25rem)] leading-[0.88] tracking-tight text-white"
          >
            <Link href={href} className="hover:text-red">
              {post.title}
            </Link>
          </h2>
          {post.tags.length > 0 && (
            <ul className="mt-8 flex min-w-0 flex-wrap gap-x-3 gap-y-2">
              {post.tags.slice(0, 6).map((tag) => (
                <li
                  key={tag}
                  className="max-w-full break-all font-mono text-[0.65rem] uppercase tracking-widest text-gray"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-10 max-w-sm font-serif text-sm italic leading-relaxed text-white/45 md:text-base">
            A record is only a record until someone reads it
          </p>
        </div>

        <div className="featured-signal-body cell relative flex min-w-0 flex-col border-r-0 border-t-0 px-6 py-8 md:px-10 md:py-10">
          <p className="meta mb-4">{post.category}</p>
          <p className="mb-8 max-w-prose font-serif text-lg leading-relaxed italic text-white/60 md:text-xl">
            {post.excerpt}
          </p>
          {preview && (
            <div className="featured-signal-fade mb-6">
              <Markdown content={preview} />
            </div>
          )}
          <Link href={href} className="ledger-nav-link mt-auto">
            continue reading
          </Link>
        </div>
      </div>
    </section>
  );
}
