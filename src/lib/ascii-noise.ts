/**
 * Deterministic signal noise for the hero's red barcode banner.
 *
 * Only glyphs already on the density ramp are used, so colour and styling do
 * not change. Every random choice is a pure function of (seed, row, col), so
 * server and client render the same text and nothing flickers. Apply it once
 * to the static hero art, after the wordmark is embedded; it then rides into
 * every frame through the static barcode overlay.
 */

/** Fixed seed. Change it to get a different, equally stable pattern. */
export const NOISE_SEED = 0x0ff51de;

/**
 * Overall dial. 1 is the tuned level (about 10-12% of banner cells touched,
 * mostly one density step). 0 turns the noise off, 2 is roughly twice as busy.
 */
export const NOISE_AMOUNT = 1;

/**
 * Banner extent in the hero source grid. Rows are [rowStart, rowEnd) minus
 * SKIP_ROWS (the dotted rule). Columns start one in from the banner's left
 * edge and stop one short of its right edge so the outline stays crisp.
 * The wings and the rule rows below the banner are never touched.
 */
export const NOISE_REGION = {
  rowStart: 0,
  rowEnd: 7,
  skipRows: [5],
  colStart: 89,
} as const;

/** Per-cell odds at NOISE_AMOUNT = 1. */
const JITTER_ODDS = 0.065; // one step lighter or (when possible) denser
const SPECK_ODDS = 0.012; // single-cell dropout, 2-4 steps lighter
const STREAKS = 4; // scan-line dropouts: a short run nudged lighter
const STREAK_LEN: readonly [number, number] = [6, 20];
const STREAK_ODDS = 0.75; // cells inside a streak that actually move
const SMEARS = 3; // vertical-hold smears: 2-4 rows down one column
const SMEAR_ROWS: readonly [number, number] = [2, 4];

const DENSITY_RAMP = " .:-=+*#%@";

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable value in [0, 1) for a cell and a purpose (salt). */
function cellRand(row: number, col: number, salt: number): number {
  const mixed = NOISE_SEED ^ Math.imul(row + 1, 73856093) ^ Math.imul(col + 1, 19349663) ^ Math.imul(salt, 83492791);
  return mulberry32(mixed)();
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Moves a glyph by `steps` on the density ramp. Unknown glyphs are left alone. */
function shift(ch: string, steps: number): string {
  const i = DENSITY_RAMP.indexOf(ch);
  if (i < 0) return ch;
  return DENSITY_RAMP[Math.max(0, Math.min(DENSITY_RAMP.length - 1, i + steps))] ?? ch;
}

function intBetween(rand: () => number, [min, max]: readonly [number, number]): number {
  return min + Math.floor(rand() * (max - min + 1));
}

/** Returns the frame with banner noise applied. Line counts and widths are unchanged. */
export function embedNoise(frame: string, amount: number = NOISE_AMOUNT): string {
  if (amount <= 0) return frame;

  const { rowStart, rowEnd, skipRows, colStart } = NOISE_REGION;
  const lines = frame.split("\n");
  const rows: string[][] = lines.map((line) => [...line]);
  const rowsInRegion: number[] = [];
  for (let r = rowStart; r < rowEnd && r < rows.length; r++) {
    if (!(skipRows as readonly number[]).includes(r)) rowsInRegion.push(r);
  }
  if (rowsInRegion.length === 0) return frame;

  /** Last editable column (exclusive) for a row: not the final glyph, not a trailing "\r". */
  const colEndFor = (r: number): number => {
    const row = rows[r]!;
    const len = row[row.length - 1] === "\r" ? row.length - 1 : row.length;
    return len - 1;
  };
  const inRegion = (r: number, c: number): boolean =>
    rowsInRegion.includes(r) && c >= colStart && c < colEndFor(r);

  // Work from the original glyphs so every effect reads the same input.
  const base = rows.map((row) => [...row]);
  const apply = (r: number, c: number, steps: number): void => {
    if (!inRegion(r, c)) return;
    rows[r]![c] = shift(rows[r]![c]!, steps);
  };

  // 1. Sparse jitter and single-cell specks.
  for (const r of rowsInRegion) {
    for (let c = colStart; c < colEndFor(r); c++) {
      const roll = cellRand(r, c, 1);
      if (roll < SPECK_ODDS * amount) {
        apply(r, c, -(2 + Math.floor(cellRand(r, c, 2) * 3)));
      } else if (roll < (SPECK_ODDS + JITTER_ODDS) * amount) {
        const ch = base[r]![c]!;
        const canGoUp = DENSITY_RAMP.indexOf(ch) < DENSITY_RAMP.length - 1;
        // Dense glyphs mostly step lighter; mid glyphs can step either way.
        const up = canGoUp && cellRand(r, c, 3) < 0.4;
        apply(r, c, up ? 1 : -1);
      }
    }
  }

  // 2. Scan-line dropouts: a horizontal run nudged one step lighter.
  const streakRand = mulberry32(NOISE_SEED ^ 0x5eaa);
  for (let i = 0; i < Math.round(STREAKS * amount); i++) {
    const r = rowsInRegion[Math.floor(streakRand() * rowsInRegion.length)]!;
    const len = intBetween(streakRand, STREAK_LEN);
    const span = Math.max(1, colEndFor(r) - colStart - len);
    const start = colStart + Math.floor(streakRand() * span);
    for (let c = start; c < start + len; c++) {
      if (streakRand() < clamp01(STREAK_ODDS)) apply(r, c, -1);
    }
  }

  // 3. Vertical-hold smears: a short column run nudged one step lighter.
  const smearRand = mulberry32(NOISE_SEED ^ 0x5bea);
  for (let i = 0; i < Math.round(SMEARS * amount); i++) {
    const r0 = rowsInRegion[Math.floor(smearRand() * rowsInRegion.length)]!;
    const c = colStart + Math.floor(smearRand() * Math.max(1, colEndFor(r0) - colStart));
    const len = intBetween(smearRand, SMEAR_ROWS);
    for (let k = 0; k < len; k++) apply(r0 + k, c, -1);
  }

  return rows.map((row) => row.join("")).join("\n");
}
