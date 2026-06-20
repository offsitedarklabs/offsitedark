import { SignalsLedger } from "@/components/signals-ledger";
import { getNewsPosts } from "@/lib/content";

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

      <SignalsLedger
        posts={posts.map(({ slug, title, date, excerpt, source, category, tags }) => ({
          slug,
          title,
          date,
          excerpt,
          source,
          category,
          tags,
        }))}
      />
    </div>
  );
}

export const metadata = { title: "News" };
