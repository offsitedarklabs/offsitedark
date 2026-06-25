import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/markdown";
import {
  formatDate,
  getGrepPostBySlug,
  getGrepPosts,
} from "@/lib/content";

export async function generateStaticParams() {
  return getGrepPosts().map((p) => ({ slug: p.slug }));
}

export default async function GrepPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getGrepPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <div className="grid md:grid-cols-[1fr_3fr]">
        <div className="cell flex items-start gap-4 border-l-0 border-t-0 p-6 md:p-10">
          <div className="min-w-0 flex-1">
            <Link href="/greps" className="back-nav-link back-nav-link--sidebar">
              ← Greps
            </Link>
            <p className="meta mt-8">{formatDate(post.date)}</p>
            <p className="meta mt-2">{post.readingMinutes} min</p>
            <p className="meta mt-8 text-white/50">
              Uploaded by {post.author}
            </p>
            <dl className="mt-8 space-y-3 font-mono text-[0.65rem] uppercase tracking-widest text-gray">
              <div>
                <dt className="text-white/40">HF Model</dt>
                <dd className="mt-1 break-all text-white/70">{post.hfModelId}</dd>
              </div>
              {post.baseModel && (
                <div>
                  <dt className="text-white/40">Base Model</dt>
                  <dd className="mt-1 break-all text-white/70">{post.baseModel}</dd>
                </div>
              )}
              {post.pipelineTag && (
                <div>
                  <dt className="text-white/40">Pipeline</dt>
                  <dd className="mt-1 text-white/70">{post.pipelineTag}</dd>
                </div>
              )}
              {post.downloads !== undefined && (
                <div>
                  <dt className="text-white/40">Downloads</dt>
                  <dd className="mt-1 text-white/70">
                    {post.downloads.toLocaleString()}
                  </dd>
                </div>
              )}
              {post.likes !== undefined && (
                <div>
                  <dt className="text-white/40">Likes</dt>
                  <dd className="mt-1 text-white/70">{post.likes}</dd>
                </div>
              )}
            </dl>
            {post.tags.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
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
          </div>
          <p className="vertical-label mt-12 shrink-0 pl-2 text-red md:pl-3">
            {post.category}
          </p>
        </div>
        <div className="cell border-r-0 border-t-0 p-6 md:py-12 md:pl-16 md:pr-12">
          <p className="meta mb-6 text-white/40">
            Community upload on Hugging Face — indexed for inquiry, not
            endorsement.
          </p>
          <h1 className="font-display mb-8 text-5xl leading-none md:text-7xl">
            {post.title}
          </h1>
          <p className="article-excerpt mb-10 font-serif text-lg italic text-white/60">
            {post.excerpt}
          </p>
          <Markdown content={post.content} />
          <div className="mt-10 flex flex-wrap gap-6">
            <a
              href={post.hfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="meta hover:text-white"
            >
              → Hugging Face
            </a>
            {post.sourceUrl && post.sourceUrl !== post.hfUrl && (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="meta hover:text-white"
              >
                → Source
              </a>
            )}
          </div>
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
  const post = getGrepPostBySlug((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}
