import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/markdown";
import { MarkKey } from "@/components/mark-key";
import { SeverityMark } from "@/components/severity-mark";
import {
  formatDate,
  getNewsPostBySlug,
  getNewsPosts,
} from "@/lib/content";
import { recordFacets } from "@/lib/record-facets";

export async function generateStaticParams() {
  return getNewsPosts().map((p) => ({ slug: p.slug }));
}

export default async function SignalsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNewsPostBySlug(slug);
  if (!post) notFound();
  const facets = recordFacets(post);

  return (
    <article className="min-w-0 overflow-x-clip">
      <div className="grid min-w-0 md:grid-cols-[1fr_3fr]">
        <div className="cell flex min-w-0 items-start gap-4 border-l-0 border-t-0 p-6 md:p-10">
          <div className="min-w-0 flex-1">
            <Link href="/signals" className="back-nav-link back-nav-link--sidebar">
              ← Signals
            </Link>
            <p className="meta mt-8">{formatDate(post.date)}</p>
            <p className="meta mt-2">{post.readingMinutes} min</p>
            {post.source && (
              <p className="meta mt-8 text-white/50">{post.source}</p>
            )}
            {post.tags.length > 0 && (
              <ul className="mt-8 flex min-w-0 flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="max-w-full break-all font-mono text-[0.65rem] uppercase tracking-widest text-gray"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            <MarkKey />
          </div>
          <p className="vertical-label mt-12 shrink-0 pl-2 text-red md:pl-3">
            {post.category}
          </p>
        </div>
        <div className="cell min-w-0 border-r-0 border-t-0 p-6 md:py-14 md:px-10 lg:px-16 xl:px-20">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <h1 className="article-title min-w-0 flex-1">{post.title}</h1>
            <SeverityMark facets={facets} />
          </div>
          <p className="article-excerpt mb-8 font-serif text-lg leading-relaxed italic text-white/60 md:text-xl">
            {post.excerpt}
          </p>
          {(facets.cve || facets.score != null || facets.status || facets.org) && (
          <dl className="record-facts">
            {facets.cve && (
              <div>
                <dt>Record</dt>
                <dd className="record-facts-id">{facets.cve}</dd>
              </div>
            )}
            {facets.score != null && facets.band && (
              <div>
                <dt>Score</dt>
                <dd className="record-facts-value">
                  <SeverityMark facets={facets} part="score" />
                </dd>
              </div>
            )}
            {facets.status && (
              <div>
                <dt>Status</dt>
                <dd className="record-facts-value">
                  <SeverityMark facets={facets} part="status" />
                  <span>
                    {facets.status === "kev"
                      ? "On the CISA catalog"
                      : facets.status === "not-kev"
                        ? "Checked, not listed"
                        : "Not stated in this record"}
                  </span>
                </dd>
              </div>
            )}
            {facets.org && (
              <div>
                <dt>Organization</dt>
                <dd>{facets.org}</dd>
              </div>
            )}
          </dl>
          )}
          <Markdown content={post.content} />
          {post.sourceUrl && (
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="meta mt-10 inline-block hover:text-white"
            >
              → Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getNewsPostBySlug((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}
