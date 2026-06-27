import Link from "next/link";

import { formatDate, type Post } from "@/lib/content";

export function EntryRow({ post }: { post: Post }) {
  const href =
    post.type === "news" ? `/news#${post.slug}` : `/research/${post.slug}`;

  return (
    <Link href={href} className="entry-row flex items-baseline justify-between gap-4 px-4 py-5 md:px-8">
      <span className="meta shrink-0">{formatDate(post.date)}</span>
      <span className="flex-1 font-serif text-lg md:text-xl">{post.title}</span>
      <span className="meta hidden shrink-0 sm:inline">{post.category}</span>
    </Link>
  );
}
