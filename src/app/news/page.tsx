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

      <div className="cell border-x-0 px-6 py-4 md:px-10">
        <p className="max-w-3xl font-serif text-base italic leading-relaxed text-white/60 md:text-lg">
          Third-party vulnerability intel indexed from public sources — Sploitus,
          Church of Malware, vx-underground, Hacker News, and others — for
          security research inquiry. OFFSITE.DARK does not discover or weaponize
          exploits; we index, analyze, attribute sources, and ask whether they
          have research value.
        </p>
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
