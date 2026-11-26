import Link from "next/link";

import { MarkKey } from "@/components/mark-key";
import { SeverityMark } from "@/components/severity-mark";
import { formatDate } from "@/lib/format";
import { recordFacets } from "@/lib/record-facets";
import type { Post } from "@/lib/post";

export function RecordLedger({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="record-ledger-title" className="record-ledger">
      <div className="record-ledger-head">
        <div>
          <p className="meta">Records</p>
          <h2 id="record-ledger-title" className="record-ledger-title">
            Latest signals
          </h2>
        </div>
        <Link href="/signals" className="ledger-nav-link">
          All signals
        </Link>
      </div>
      <MarkKey variant="strip" />
      <div className="record-ledger-columns" aria-hidden>
        <span>Record</span>
        <span>Status</span>
        <span>Updated</span>
      </div>
      <ul>
        {posts.map((post) => {
          const facets = recordFacets(post);
          return (
            <li key={post.slug}>
              <Link href={`/signals/${post.slug}`} className="record-row">
                <span className="record-row-id">
                  {facets.cve ?? "Note"}
                </span>
                <span className="record-row-main">
                  <span className="record-row-title">{post.title}</span>
                  {facets.org && (
                    <span className="record-row-org">{facets.org}</span>
                  )}
                </span>
                <span className="record-row-status">
                  <SeverityMark facets={facets} compact showOpen />
                </span>
                <time className="record-row-date" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
