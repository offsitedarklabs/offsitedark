"use client";

import { useSyncExternalStore } from "react";

function randomOutput(): number {
  return Math.floor(Math.random() * 900) + 100;
}

function randomSeed(): number {
  return Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000;
}

let clientMeta: { output: number; seed: number } | null = null;

function getClientMeta(): { output: number; seed: number } {
  clientMeta ??= { output: randomOutput(), seed: randomSeed() };
  return clientMeta;
}

export function OutputSeedMeta({ className = "meta mt-8" }: { className?: string }) {
  const meta = useSyncExternalStore(
    () => () => {},
    getClientMeta,
    () => null,
  );

  return (
    <p className={className} suppressHydrationWarning>
      {meta ? `OUTPUT ${meta.output} · SEED: ${meta.seed}` : "\u00A0"}
    </p>
  );
}
