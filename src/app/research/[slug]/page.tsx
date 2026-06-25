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
    <article>
      <div className="grid md:grid-cols-[1fr_3fr]">
        <div className="cell flex items-start gap-4 border-l-0 border-t-0 p-6 md:p-10">
          <div className="min-w-0 flex-1">
            <Link
              href="/research"
              className="back-nav-link back-nav-link--sidebar"
            >
              ← Research
            </Link>
            <p className="meta mt-8">{formatDate(post.date)}</p>
            <p className="meta mt-2">{post.readingMinutes} min</p>
          </div>
          <p className="vertical-label mt-12 shrink-0 pl-2 text-red md:pl-3">
            {post.category}
          </p>
        </div>
        <div className="cell border-r-0 border-t-0 p-6 md:py-12 md:pl-16 md:pr-12">
          <h1 className="font-display mb-8 text-5xl leading-none md:text-7xl">
            {post.title}
          </h1>
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
