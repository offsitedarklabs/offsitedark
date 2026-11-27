/**
 * Faint OFFSITEDARK wordmark for the hero ASCII.
 *
 * The hero art has a dense "@" banner in its top-right corner. Cells under the
 * wordmark letters are nudged a couple of steps down the density ramp, so the
 * word only just reads through the existing texture. Nothing else is touched:
 * the same characters, the same colour, the same layout.
 */

/** 5-row pixel font. "X" is a lit pixel. Only the letters in OFFSITEDARK. */
export const WORDMARK_FONT: Readonly<Record<string, readonly string[]>> = {
  O: [".XX.", "X..X", "X..X", "X..X", ".XX."],
  F: ["XXXX", "X...", "XXX.", "X...", "X..."],
  S: [".XXX", "X...", ".XX.", "...X", "XXX."],
  I: ["XXX", ".X.", ".X.", ".X.", "XXX"],
  T: ["XXXX", ".XX.", ".XX.", ".XX.", ".XX."],
  E: ["XXXX", "X...", "XXX.", "X...", "XXXX"],
  D: ["XXX.", "X..X", "X..X", "X..X", "XXX."],
  A: [".XX.", "X..X", "XXXX", "X..X", "X..X"],
  R: ["XXX.", "X..X", "XXX.", "X.X.", "X..X"],
  K: ["X..X", "X.X.", "XX..", "X.X.", "X..X"],
};

export const WORDMARK_TEXT = "OFFSITEDARK";

/** Blank font pixels between letters. */
export const WORDMARK_LETTER_GAP = 1;

/**
 * Where the wordmark sits in the hero source grid (before any resampling).
 * Columns are [colStart, colEnd) and rows start at rowStart. The wordmark is
 * stretched across the column range, so it stays aligned when the hero is
 * resampled to another size.
 *
 * A source cell renders about 3.1 px wide by 13 px tall, so a 1:1 pixel font
 * comes out tall and narrow. The range is the whole barcode banner (cols
 * 87-174, one column in from each edge), which stretches each font pixel to
 * about 1.6 columns (5 px). Letters are then about 20 px wide by 65 px tall,
 * instead of the 12 px by 65 px they were at one column per pixel.
 */
export const WORDMARK_BOUNDS = { rowStart: 0, colStart: 88, colEnd: 174 } as const;

/**
 * How many steps down the density ramp a wordmark cell moves. 3 is "@" → "*".
 * 1 is barely there, 4+ starts to read as bold.
 */
export const WORDMARK_FADE_STEPS = 3;

/** Light to dense, as used by the hero art. */
const DENSITY_RAMP = " .:-=+*#%@";

/** Only cells at least this dense are faded, so existing dark spots stay put. */
const MIN_FADED_DENSITY = DENSITY_RAMP.indexOf("#");

function buildWordmarkBitmap(
  text: string,
  font: Readonly<Record<string, readonly string[]>>,
): boolean[][] {
  const glyphs = [...text].map((ch) => font[ch] ?? []);
  const height = Math.max(0, ...glyphs.map((g) => g.length));
  const rows: boolean[][] = Array.from({ length: height }, () => []);

  glyphs.forEach((glyph, index) => {
    if (index > 0) {
      for (let g = 0; g < WORDMARK_LETTER_GAP; g++) {
        rows.forEach((row) => row.push(false));
      }
    }
    const width = Math.max(0, ...glyph.map((line) => line.length));
    for (let r = 0; r < height; r++) {
      const line = glyph[r] ?? "";
      for (let c = 0; c < width; c++) rows[r]!.push(line[c] === "X");
    }
  });

  return rows;
}

/** Reusable bitmap: rows of lit pixels for WORDMARK_TEXT. */
export const WORDMARK_BITMAP = buildWordmarkBitmap(WORDMARK_TEXT, WORDMARK_FONT);

/** Returns the frame with the wordmark faded into its dense cells. */
export function embedWordmark(frame: string): string {
  const { rowStart, colStart, colEnd } = WORDMARK_BOUNDS;
  const bitmapRows = WORDMARK_BITMAP.length;
  const bitmapCols = WORDMARK_BITMAP[0]?.length ?? 0;
  if (bitmapRows === 0 || bitmapCols === 0) return frame;

  const span = colEnd - colStart;
  const lines = frame.split("\n");

  for (let r = 0; r < bitmapRows; r++) {
    const line = lines[rowStart + r];
    if (line === undefined) continue;
    const chars = [...line];

    for (let c = colStart; c < colEnd && c < chars.length; c++) {
      const bx = Math.floor(((c - colStart) * bitmapCols) / span);
      if (!WORDMARK_BITMAP[r]![bx]) continue;

      const density = DENSITY_RAMP.indexOf(chars[c]!);
      if (density < MIN_FADED_DENSITY) continue;
      chars[c] = DENSITY_RAMP[density - WORDMARK_FADE_STEPS] ?? chars[c]!;
    }

    lines[rowStart + r] = chars.join("");
  }

  return lines.join("\n");
}
