import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/markdown";
import { formatDate, getPostBySlug, getResearchPosts } from "@/lib/content";

export async function generateStaticParams() {
  return getResearchPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.type !== "research") notFound();

  return (
    <article className="min-w-0 overflow-x-clip">
      <div className="grid min-w-0 md:grid-cols-[1fr_3fr]">
        <div className="cell flex min-w-0 items-start gap-4 border-l-0 border-t-0 p-6 md:p-10">
          <div className="min-w-0 flex-1">
            <Link
              href="/research"
              className="back-nav-link back-nav-link--sidebar"
            >
              ← Research
            </Link>
            <p className="meta mt-8">{formatDate(post.date)}</p>
            <p className="meta mt-2">{post.readingMinutes} min</p>
            {post.wip && <p className="meta mt-2">WIP</p>}
          </div>
          <p className="vertical-label mt-12 shrink-0 pl-2 text-red md:pl-3">
            {post.category}
          </p>
        </div>
        <div className="cell min-w-0 border-r-0 border-t-0 p-6 md:py-12 md:pl-16 md:pr-12">
          {post.wip && (
            <div
              className="mb-8 border border-red px-4 py-3 md:mb-10 md:px-6 md:py-4"
              role="status"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-red">
                Work in progress
              </p>
              <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-wider text-white/50">
                This article is unfinished — content may change or be incomplete.
              </p>
            </div>
          )}
          <h1 className="article-title mb-8">{post.title}</h1>
          <p className="article-excerpt mb-10 font-serif text-lg italic text-white/60">
            {post.excerpt}
          </p>
          <Markdown content={post.content} />
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
  const post = getPostBySlug((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}
