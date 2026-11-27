import Link from "next/link";

import { EntryRow } from "@/components/entry-row";
import { SlashMark } from "@/components/slash-mark";
import { getResearchPosts } from "@/lib/content";
import type { Category } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/metadata";

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

      <div className="grid min-w-0 md:grid-cols-[220px_1fr]">
        <aside className="cell flex min-w-0 items-start gap-4 border-l-0 border-t-0 p-6">
          <p className="vertical-label shrink-0 text-red">Directory</p>
          <nav className="min-w-0 flex-1 flex flex-row flex-wrap gap-x-4 gap-y-1 md:flex-col md:gap-1">
            <Link
              href="/research"
              className={`inline-flex min-h-[36px] items-center font-mono text-xs uppercase md:min-h-0 ${!active ? "text-red" : "text-gray hover:text-white"}`}
            >
              / all
            </Link>
            {["malware", "reversing", "infra", "tools", "ai"].map((cat) => (
              <Link
                key={cat}
                href={`/research?category=${cat}`}
                className={`inline-flex min-h-[36px] items-center font-mono text-xs uppercase md:min-h-0 ${active === cat ? "text-red" : "text-gray hover:text-white"}`}
              >
                / {cat}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="cell min-w-0 border-r-0 border-t-0">
          <SlashMark rows={2} className="px-4 pt-4" />
          <p className="meta px-4 py-4 md:px-8">{posts.length} entries</p>
          {posts.map((post) => (
            <EntryRow key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata = buildPageMetadata({
  title: "Research",
  description:
    "Original security research, malware analysis, reverse engineering, infrastructure, and AI security articles.",
  path: "/research",
});
