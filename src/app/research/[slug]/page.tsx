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
        <div className="cell border-l-0 border-t-0 p-6 md:p-10">
          <Link
            href="/research"
            className="meta hover:text-white"
          >
            ← Research
          </Link>
          <p className="vertical-label mt-12 text-red">{post.category}</p>
          <p className="meta mt-8">{formatDate(post.date)}</p>
          <p className="meta mt-2">{post.readingMinutes} min</p>
        </div>
        <div className="cell border-r-0 border-t-0 p-6 md:p-12 md:pr-16">
          <h1 className="font-display mb-8 text-5xl leading-none md:text-7xl">
            {post.title}
          </h1>
          <p className="mb-10 max-w-prose font-serif text-lg italic text-white/60">
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
