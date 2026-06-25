import Link from "next/link";
import { notFound } from "next/navigation";

import { ToolDetailSections } from "@/components/tool-detail-sections";
import {
  getAllToolSlugs,
  getCategoryLabel,
  getToolBySlug,
} from "@/lib/tools-registry";

export async function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const categoryLabel = getCategoryLabel(tool.category);

  return (
    <article>
      <div className="grid md:grid-cols-[1fr_3fr]">
        <div className="cell flex items-start gap-4 border-l-0 border-t-0 p-6 md:p-10">
          <div className="min-w-0 flex-1">
            <Link href="/tools" className="back-nav-link back-nav-link--sidebar">
              ← Tools
            </Link>
            {tool.kaliLetter && (
              <p className="meta mt-8">Index · {tool.kaliLetter}</p>
            )}
            {tool.tags && tool.tags.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
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
            {categoryLabel}
          </p>
        </div>

        <div className="cell border-r-0 border-t-0 p-6 md:py-14 md:px-10 lg:px-16 xl:px-20">
          <h1 className="font-display mb-10 text-5xl leading-none text-red md:text-7xl">
            {tool.name}
          </h1>

          <div className="prose-lab">
            <ToolDetailSections tool={tool} />
          </div>

          {tool.externalHref && (
            <a
              href={tool.externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="meta mt-10 inline-block hover:text-white"
            >
              → official site
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
  const tool = getToolBySlug((await params).slug);
  if (!tool) return {};
  const summary =
    tool.overview?.[0] ?? tool.description;
  return { title: tool.name, description: summary };
}
