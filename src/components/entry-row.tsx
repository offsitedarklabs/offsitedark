import Link from "next/link";

import { formatDate } from "@/lib/format";
import type { EntryRowData } from "@/lib/post";

type EntryRowProps = {
  post: EntryRowData;
  isActive?: boolean;
  onSelect?: () => void;
};

const rowClass = (isActive?: boolean) =>
  `entry-row flex w-full items-baseline justify-between gap-4 px-4 py-5 text-left md:px-8${
    isActive ? " entry-row-active" : ""
  }`;

function EntryRowContent({ post }: { post: EntryRowData }) {
  return (
    <>
      <span className="meta shrink-0">{formatDate(post.date)}</span>
      <span className="flex-1 font-serif text-lg md:text-xl">{post.title}</span>
      <span className="flex shrink-0 items-baseline gap-3">
        {post.wip && <span className="meta">WIP</span>}
        <span className="meta hidden sm:inline">{post.category}</span>
      </span>
    </>
  );
}

export function EntryRow({ post, isActive, onSelect }: EntryRowProps) {
  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={rowClass(isActive)}
        aria-current={isActive ? "true" : undefined}
      >
        <EntryRowContent post={post} />
      </button>
    );
  }

  const href =
    post.type === "news" ? `/signals/${post.slug}` : `/research/${post.slug}`;

  return (
    <Link href={href} className={rowClass(isActive)}>
      <EntryRowContent post={post} />
    </Link>
  );
}
