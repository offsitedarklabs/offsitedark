"use client";

import { useEffect, useState } from "react";

function randomOutput(): number {
  return Math.floor(Math.random() * 900) + 100;
}

function randomSeed(): number {
  return Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000;
}

export function OutputSeedMeta({ className = "meta mt-8" }: { className?: string }) {
  const [meta, setMeta] = useState<{ output: number; seed: number } | null>(
    null,
  );

  useEffect(() => {
    setMeta({ output: randomOutput(), seed: randomSeed() });
  }, []);

  return (
    <p className={className} suppressHydrationWarning>
      {meta ? `OUTPUT ${meta.output} · SEED: ${meta.seed}` : "\u00A0"}
    </p>
  );
}
