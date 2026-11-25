import fs from "fs";
import path from "path";

import { AsciiBlink } from "./ascii-blink";
import { AsciiScaler } from "./ascii-scaler";

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
 * Loads public/ascii/hero-blink/b{blink}w{wing}.txt.
 * blink 0..8 is open → closed, in even steps. Opening plays those
 * frames backward. wing 0..2 is tips at rest → splayed.
 */
function loadHeroFrames(): string[] | null {
  const frames: string[] = [];
  for (let blink = 0; blink < BLINK_COUNT; blink++) {
    for (let wing = 0; wing < WING_COUNT; wing++) {
      const frame = tryLoadAscii("hero-blink", `b${blink}w${wing}.txt`);
      if (!frame) return null;
      frames.push(frame);
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

  const content = loadAscii(file);
  return <AsciiScaler content={content} sizeToContent={sizeToContent} />;
}
