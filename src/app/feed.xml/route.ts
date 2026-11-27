import { getAllPosts } from "@/lib/content";
import { SITE } from "@/lib/constants";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function escapeCdata(value: string): string {
  return value.replaceAll("]]>", "]]]]><![CDATA[>");
}

export async function GET() {
  try {
    const items = getAllPosts()
      .map((p) => {
        const itemUrl = `${SITE.url}${
          p.type === "research" ? `/research/${p.slug}` : `/signals/${p.slug}`
        }`;
        const parsedDate = new Date(p.date);
        const pubDateTag = Number.isNaN(parsedDate.getTime())
          ? ""
          : `\n      <pubDate>${parsedDate.toUTCString()}</pubDate>`;

        return `<item>
      <title><![CDATA[${escapeCdata(p.title)}]]></title>
      <link>${escapeXml(itemUrl)}</link>
      <guid isPermaLink="true">${escapeXml(itemUrl)}</guid>
      <description><![CDATA[${escapeCdata(p.excerpt)}]]></description>${pubDateTag}
    </item>`;
      })
      .join("");

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${escapeXml(SITE.name)}</title>
<link>${escapeXml(SITE.url)}</link>
<description>${escapeXml(SITE.description)}</description>
${items}
</channel></rss>`,
      { headers: { "Content-Type": "application/xml; charset=utf-8" } },
    );
  } catch {
    return new Response("Failed to generate RSS feed.", { status: 500 });
  }
}
