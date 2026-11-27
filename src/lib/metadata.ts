import type { Metadata } from "next";

import { SITE } from "./constants";

interface PageMetadataOptions {
  title?: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
}

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: PageMetadataOptions): Metadata {
  const ogTitle = title ? `${title} — ${SITE.name}` : SITE.name;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      siteName: SITE.name,
      type,
      title: ogTitle,
      description,
      url: path,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary",
      title: ogTitle,
      description,
    },
  };
}
