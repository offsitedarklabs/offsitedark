import { getAllPosts } from "@/lib/content";
import { SITE } from "@/lib/constants";

export async function GET() {
  const items = getAllPosts()
    .map(
      (p) => `<item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE.url}${p.type === "research" ? `/research/${p.slug}` : `/news#${p.slug}`}</link>
      <description><![CDATA[${p.excerpt}]]></description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${SITE.name}</title>
<link>${SITE.url}</link>
<description>${SITE.description}</description>
${items}
</channel></rss>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
