import { EntryRow } from "@/components/entry-row";
import { Markdown } from "@/components/markdown";
import { SlashMark } from "@/components/slash-mark";
import { formatDate, getNewsPosts } from "@/lib/content";

export default function NewsPage() {
  const posts = getNewsPosts();

  return (
    <div>
      <div className="bg-red px-4 py-6 md:px-8">
        <p className="meta text-black/60">Transmission</p>
        <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-none text-black">
          SIGNALS
        </h1>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="cell border-l-0 border-t-0">
          <SlashMark rows={3} className="p-4" />
          {posts.map((post) => (
            <EntryRow key={post.slug} post={post} />
          ))}
        </div>
        <div className="cell border-r-0 border-t-0">
          {posts.map((post) => (
            <article
              key={post.slug}
              id={post.slug}
              className="scroll-mt-20 border-b border-red p-8 md:p-12"
            >
              <p className="meta mb-4">
                {formatDate(post.date)}
                {post.source ? ` · ${post.source}` : ""}
              </p>
              <h2 className="font-display mb-6 text-4xl">{post.title}</h2>
              <Markdown content={post.content} />
              {post.sourceUrl && (
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meta mt-6 inline-block hover:text-white"
                >
                  → Source
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata = { title: "News" };
