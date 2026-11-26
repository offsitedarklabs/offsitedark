import {
  severityLabel,
  type RecordFacets,
} from "@/lib/record-facets";

export function SeverityMark({
  facets,
  compact = false,
  part = "all",
  showOpen = false,
}: {
  facets: RecordFacets;
  compact?: boolean;
  part?: "all" | "score" | "status";
  showOpen?: boolean;
}) {
  const showScore = part !== "status";
  const showStatus = part !== "score";
  const scored = showScore && facets.band != null && facets.score != null;
  const kev = showStatus && facets.status === "kev";
  const unverified = showStatus && facets.status === "unverified";
  const open =
    showStatus && facets.status === "not-kev" && (part === "status" || showOpen);

  if (!scored && !kev && !unverified && !open) return null;

  const score =
    facets.score == null
      ? null
      : Number.isInteger(facets.score)
        ? String(facets.score)
        : facets.score.toFixed(1);

  return (
    <span className="severity-marks">
      {scored && facets.band && score && (
        <span className={`sev sev-${facets.band}`}>
          {compact
            ? score
            : facets.mixed
              ? `${severityLabel(facets.band)} up to ${score}`
              : `${severityLabel(facets.band)} ${score}`}
        </span>
      )}
      {kev && <span className="status-kev">KEV</span>}
      {open && <span className="status-open">Not KEV</span>}
      {unverified && <span className="status-open">Unverified</span>}
    </span>
  );
}
