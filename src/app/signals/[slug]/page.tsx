import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/markdown";
import {
  formatDate,
  getNewsPostBySlug,
  getNewsPosts,
} from "@/lib/content";

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
          </div>
          <p className="vertical-label mt-12 shrink-0 pl-2 text-red md:pl-3">
            {post.category}
          </p>
        </div>
        <div className="cell min-w-0 border-r-0 border-t-0 p-6 md:py-14 md:px-10 lg:px-16 xl:px-20">
          <h1 className="article-title mb-10">{post.title}</h1>
          <p className="article-excerpt mb-12 font-serif text-lg leading-relaxed italic text-white/60 md:text-xl">
            {post.excerpt}
          </p>
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
