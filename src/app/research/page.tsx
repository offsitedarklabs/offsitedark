import Link from "next/link";

import { EntryRow } from "@/components/entry-row";
import { SlashMark } from "@/components/slash-mark";
import { getResearchPosts } from "@/lib/content";
import type { Category } from "@/lib/constants";

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = category as Category | undefined;
  const posts = active
    ? getResearchPosts().filter((p) => p.category === active)
    : getResearchPosts();

  return (
    <div>
      <div className="bg-red px-4 py-6 md:px-8">
        <p className="meta text-black/60">Archive</p>
        <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-none text-black">
          RESEARCH
        </h1>
      </div>

      <div className="grid md:grid-cols-[200px_1fr]">
        <aside className="cell border-l-0 border-t-0 p-6">
          <p className="vertical-label text-red">Directory</p>
          <nav className="mt-8 flex flex-row flex-wrap gap-2 md:mt-0 md:flex-col md:gap-1">
            <Link
              href="/research"
              className={`font-mono text-xs uppercase ${!active ? "text-red" : "text-gray hover:text-white"}`}
            >
              / all
            </Link>
            {["malware", "reversing", "infra", "tools"].map((cat) => (
              <Link
                key={cat}
                href={`/research?category=${cat}`}
                className={`font-mono text-xs uppercase ${active === cat ? "text-red" : "text-gray hover:text-white"}`}
              >
                / {cat}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="cell border-r-0 border-t-0">
          <SlashMark rows={2} className="px-4 pt-4" />
          <p className="meta px-8 py-4">{posts.length} entries</p>
          {posts.map((post) => (
            <EntryRow key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata = { title: "Research" };
