export function SlashMark({ rows = 3, className = "" }: { rows?: number; className?: string }) {
  const line = "//////////////////////////////////////////////";
  return (
    <div className={`slash overflow-hidden text-xs md:text-sm ${className}`} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
