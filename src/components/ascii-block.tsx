import fs from "fs";
import path from "path";

import { AsciiBlink } from "./ascii-blink";
import { AsciiScaler } from "./ascii-scaler";
import { embedNoise } from "@/lib/ascii-noise";
import { embedWordmark } from "@/lib/ascii-wordmark";

const BLINK_COUNT = 9;
const WING_COUNT = 3;

function asciiPath(...parts: string[]): string {
  return path.join(process.cwd(), "public", "ascii", ...parts);
}

function loadAscii(filename: string): string {
  try {
    return fs.readFileSync(asciiPath(filename), "utf8");
  } catch {
    return "[ signal lost ]";
  }
}

function tryLoadAscii(...parts: string[]): string | null {
  try {
    return fs.readFileSync(asciiPath(...parts), "utf8");
  } catch {
    return null;
  }
}

/** Per-line widths, before padding. A shared max width can still hide a short line. */
function lineWidths(content: string): number[] {
  return content.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n").map((line) => line.length);
}

function sameGeometry(frames: string[]): boolean {
  if (frames.length === 0) return false;
  const base = lineWidths(frames[0] ?? "");
  if (base.length === 0) return false;
  return frames.every((frame) => {
    const widths = lineWidths(frame);
    return widths.length === base.length && widths.every((width, i) => width === base[i]);
  });
}

/**
 * The barcode band, its towers and the dotted rule beside them are the
 * original hero.txt art. They do not animate and are never taken from a
 * wing frame: every cell in this mask is read from hero.txt.
 * Rows above BARCODE_ROWS are fully static; rows BARCODE_ROWS..RULE_ROWS-1
 * are static only for columns RULE_COL_START..RULE_COL_END-1 (the rule).
 * Keep these in step with WING_TOP / RULE_ROWS_END / RULE_END_COL in
 * scripts/generate-hero-blink.py.
 */
const BARCODE_ROWS = 7;
const RULE_ROWS = 10;
const RULE_COL_START = 60;
const RULE_COL_END = 140;

function normalizeLines(content: string): string[] {
  return content.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n");
}

/** Lays the static hero.txt barcode cells over a wing/blink frame. */
function withStaticBarcode(frame: string, staticLines: string[]): string {
  const lines = normalizeLines(frame);
  for (let r = 0; r < RULE_ROWS && r < lines.length; r++) {
    const base = staticLines[r];
    if (base === undefined) continue;
    if (r < BARCODE_ROWS) {
      lines[r] = base;
      continue;
    }
    const line = lines[r] ?? "";
    lines[r] =
      line.slice(0, RULE_COL_START) +
      base.slice(RULE_COL_START, RULE_COL_END) +
      line.slice(RULE_COL_END);
  }
  return lines.join("\n");
}

/**
 * Loads public/ascii/hero-blink/b{blink}w{wing}.txt.
 * blink 0..8 is open → closed, in even steps. Opening plays those
 * frames backward. wing 0..2 is tips at rest → splayed.
 * The barcode cells always come from hero.txt (with the faint wordmark and
 * the banner noise embedded once), so only the wings and the eye ever change.
 */
function loadHeroFrames(): string[] | null {
  const hero = tryLoadAscii("hero.txt");
  if (!hero) return null;
  const staticLines = normalizeLines(
    embedNoise(embedWordmark(hero.replace(/\r\n/g, "\n"))),
  );

  const frames: string[] = [];
  for (let blink = 0; blink < BLINK_COUNT; blink++) {
    for (let wing = 0; wing < WING_COUNT; wing++) {
      const frame = tryLoadAscii("hero-blink", `b${blink}w${wing}.txt`);
      if (!frame) return null;
      frames.push(withStaticBarcode(frame, staticLines));
    }
  }
  if (!sameGeometry(frames)) return null;
  return frames;
}

export function AsciiBlock({
  file = "hero.txt",
  sizeToContent = false,
}: {
  file?: string;
  sizeToContent?: boolean;
}) {
  if (file === "hero.txt" && !sizeToContent) {
    const frames = loadHeroFrames();
    if (frames) {
      return (
        <AsciiBlink
          frames={frames}
          blinkCount={BLINK_COUNT}
          wingCount={WING_COUNT}
          sizeToContent={sizeToContent}
        />
      );
    }
  }

  const raw = loadAscii(file);
  const content = file === "hero.txt" ? embedNoise(embedWordmark(raw)) : raw;
  return <AsciiScaler content={content} sizeToContent={sizeToContent} />;
}
