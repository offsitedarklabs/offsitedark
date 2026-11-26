import Link from "next/link";

import { SeverityMark } from "@/components/severity-mark";
import { formatDate } from "@/lib/format";
import type { RecordFacets } from "@/lib/record-facets";
import type { EntryRowData } from "@/lib/post";

type EntryRowProps = {
  post: EntryRowData;
  isActive?: boolean;
  onSelect?: () => void;
  facets?: RecordFacets;
};

const rowClass = (isActive?: boolean) =>
  `entry-row flex w-full items-baseline justify-between gap-4 px-4 py-5 text-left md:px-8${
    isActive ? " entry-row-active" : ""
  }`;

function EntryRowContent({
  post,
  facets,
}: {
  post: EntryRowData;
  facets?: RecordFacets;
}) {
  return (
    <>
      <span className="meta shrink-0">{formatDate(post.date)}</span>
      <span className="min-w-0 flex-1 font-serif text-lg md:text-xl">{post.title}</span>
      <span className="flex shrink-0 items-center gap-2">
        {facets && <SeverityMark facets={facets} compact />}
        {post.wip && <span className="meta">WIP</span>}
        <span className="meta hidden lg:inline">{post.category}</span>
      </span>
    </>
  );
}

export function EntryRow({ post, isActive, onSelect, facets }: EntryRowProps) {
  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={rowClass(isActive)}
        aria-current={isActive ? "true" : undefined}
      >
        <EntryRowContent post={post} facets={facets} />
      </button>
    );
  }

  const href =
    post.type === "news" ? `/signals/${post.slug}` : `/research/${post.slug}`;

  return (
    <Link href={href} className={rowClass(isActive)}>
      <EntryRowContent post={post} facets={facets} />
    </Link>
  );
}
