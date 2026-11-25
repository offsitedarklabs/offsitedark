"use client";

import { useEffect, useState } from "react";

import { AsciiScaler } from "./ascii-scaler";

/** Slow mysterious blink — times in ms. Close and reopen share one duration. */
const OPEN_HOLD_MS = [4200, 7600] as const;
const LID_MOVE_MS = [640, 1040] as const;
const CLOSED_HOLD_MS = [240, 480] as const;

/** Wing tips ease out, then back. One step of the splay sequence. */
const WING_STEP_MS = 780;

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Pre-rendered frames, row-major: index = blinkIndex * wingCount + wingIndex.
 * Blink index 0 is open and the last index is closed.
 * Wing index 0 is resting tips; higher indexes splay the tips outward.
 */
export function AsciiBlink({
  frames,
  blinkCount,
  wingCount,
  sizeToContent = false,
}: {
  frames: string[];
  blinkCount: number;
  wingCount: number;
  sizeToContent?: boolean;
}) {
  const [blink, setBlink] = useState(0);
  const [wing, setWing] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(motionMq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    motionMq.addEventListener("change", onChange);
    return () => motionMq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion || blinkCount < 2) {
      setBlink(0);
      return;
    }

    let cancelled = false;
    let timeoutId: number | undefined;
    let finishDelay: (() => void) | undefined;
    // Index 0 is open and the last index is closed. Opening plays this
    // exact list backward, one frame at a time, at the same step.
    const forward = Array.from({ length: blinkCount }, (_, i) => i);

    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        finishDelay = resolve;
        timeoutId = window.setTimeout(() => {
          finishDelay = undefined;
          resolve();
        }, ms);
      });

    async function runBlinkLoop() {
      let first = true;
      while (!cancelled) {
        // The first close starts with the page so the blink is visible on load.
        // Later blinks keep the same open hold between them.
        if (!first) {
          setBlink(0);
          await delay(randBetween(OPEN_HOLD_MS[0], OPEN_HOLD_MS[1]));
          if (cancelled) break;
        }
        first = false;

        const moveMs = randBetween(LID_MOVE_MS[0], LID_MOVE_MS[1]);
        const step = moveMs / (forward.length - 1);

        for (let i = 1; i < forward.length; i++) {
          setBlink(forward[i] ?? 0);
          await delay(step);
          if (cancelled) return;
        }

        await delay(randBetween(CLOSED_HOLD_MS[0], CLOSED_HOLD_MS[1]));
        if (cancelled) break;

        for (let i = forward.length - 2; i >= 0; i--) {
          setBlink(forward[i] ?? 0);
          await delay(step);
          if (cancelled) return;
        }
      }
    }

    void runBlinkLoop();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      // Clearing the timer leaves the await hanging. Wake it so the loop
      // sees `cancelled` and returns.
      finishDelay?.();
      finishDelay = undefined;
    };
  }, [blinkCount, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || wingCount < 2) {
      setWing(0);
      return;
    }

    // 0 → 1 → … → full → … → 1 → 0
    const sequence: number[] = [];
    for (let i = 0; i < wingCount; i++) sequence.push(i);
    for (let i = wingCount - 2; i >= 0; i--) sequence.push(i);

    let step = 0;
    const id = window.setInterval(() => {
      step = (step + 1) % sequence.length;
      setWing(sequence[step] ?? 0);
    }, WING_STEP_MS);

    return () => window.clearInterval(id);
  }, [reduceMotion, wingCount]);

  const index = blink * wingCount + wing;
  const content = frames[index] ?? frames[0] ?? "";

  return <AsciiScaler content={content} sizeToContent={sizeToContent} />;
}
