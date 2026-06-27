"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const REF_FONT_SIZE = 10;
const MIN_FONT_SIZE = 4;
const MAX_COLS = 600;
const MAX_ROWS = 400;

interface AsciiScalerProps {
  content: string;
}

interface CharMetrics {
  unitWidth: number;
  unitHeight: number;
}

interface Layout {
  cols: number;
  rows: number;
  fontSize: number;
  text: string;
}

function parseAsciiGrid(content: string): string[][] {
  const lines = content.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n");
  if (lines.length === 0) return [[" "]];

  const maxWidth = Math.max(...lines.map((line) => line.length), 1);
  return lines.map((line) => {
    const chars = [...line];
    while (chars.length < maxWidth) chars.push(" ");
    return chars;
  });
}

function resampleGrid(
  source: string[][],
  targetCols: number,
  targetRows: number,
): string[][] {
  const srcRows = source.length;
  const srcCols = source[0]?.length ?? 1;
  const grid: string[][] = [];

  for (let r = 0; r < targetRows; r++) {
    const srcR = Math.min(
      srcRows - 1,
      Math.floor((r * srcRows) / targetRows),
    );
    const row: string[] = [];

    for (let c = 0; c < targetCols; c++) {
      const srcC = Math.min(
        srcCols - 1,
        Math.floor((c * srcCols) / targetCols),
      );
      row.push(source[srcR]![srcC]!);
    }

    grid.push(row);
  }

  return grid;
}

function gridToString(grid: string[][]): string {
  return grid.map((row) => row.join("")).join("\n");
}

function fitFontSize(
  cw: number,
  ch: number,
  cols: number,
  rows: number,
  unitW: number,
  unitH: number,
): number {
  return Math.min(cw / (cols * unitW), ch / (rows * unitH));
}

function computeLayout(
  cw: number,
  ch: number,
  metrics: CharMetrics,
  source: string[][],
): Layout | null {
  if (cw <= 0 || ch <= 0) return null;

  const { unitWidth, unitHeight } = metrics;
  const refCharW = REF_FONT_SIZE * unitWidth;
  const refCharH = REF_FONT_SIZE * unitHeight;

  let cols = Math.max(1, Math.min(MAX_COLS, Math.floor(cw / refCharW)));
  let rows = Math.max(1, Math.min(MAX_ROWS, Math.floor(ch / refCharH)));

  let fontSize = fitFontSize(cw, ch, cols, rows, unitWidth, unitHeight);

  // Greedy expansion: add columns/rows while density stays high and slack shrinks.
  let changed = true;
  while (changed) {
    changed = false;

    if (cols < MAX_COLS) {
      const nextCols = cols + 1;
      const nextFs = fitFontSize(
        cw,
        ch,
        nextCols,
        rows,
        unitWidth,
        unitHeight,
      );
      if (
        nextFs >= MIN_FONT_SIZE &&
        nextCols * nextFs * unitWidth <= cw + 0.5 &&
        nextFs >= fontSize * 0.99
      ) {
        cols = nextCols;
        fontSize = nextFs;
        changed = true;
      }
    }

    if (rows < MAX_ROWS) {
      const nextRows = rows + 1;
      const nextFs = fitFontSize(
        cw,
        ch,
        cols,
        nextRows,
        unitWidth,
        unitHeight,
      );
      if (
        nextFs >= MIN_FONT_SIZE &&
        nextRows * nextFs * unitHeight <= ch + 0.5 &&
        nextFs >= fontSize * 0.99
      ) {
        rows = nextRows;
        fontSize = nextFs;
        changed = true;
      }
    }
  }

  fontSize = Math.max(
    MIN_FONT_SIZE,
    fitFontSize(cw, ch, cols, rows, unitWidth, unitHeight),
  );

  const resampled = resampleGrid(source, cols, rows);
  return {
    cols,
    rows,
    fontSize,
    text: gridToString(resampled),
  };
}

function measureCharMetrics(pre: HTMLPreElement): CharMetrics | null {
  pre.style.fontSize = `${REF_FONT_SIZE}px`;
  pre.textContent = "0".repeat(10);

  const rect = pre.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  return {
    unitWidth: rect.width / 10 / REF_FONT_SIZE,
    unitHeight: rect.height / REF_FONT_SIZE,
  };
}

export function AsciiScaler({ content }: AsciiScalerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLPreElement>(null);
  const rafRef = useRef<number | null>(null);
  const metricsRef = useRef<CharMetrics | null>(null);

  const [layout, setLayout] = useState<Layout | null>(null);
  const [animateResize, setAnimateResize] = useState(false);

  const sourceGrid = useMemo(() => parseAsciiGrid(content), [content]);
  const fallbackText = useMemo(() => gridToString(sourceGrid), [sourceGrid]);

  const refit = useCallback(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    if (cw === 0 || ch === 0) return;

    if (!metricsRef.current) {
      metricsRef.current = measureCharMetrics(measure);
    }

    const metrics = metricsRef.current;
    if (!metrics) return;

    const next = computeLayout(cw, ch, metrics, sourceGrid);
    if (!next) return;

    setLayout((prev) => {
      if (
        prev &&
        prev.cols === next.cols &&
        prev.rows === next.rows &&
        Math.abs(prev.fontSize - next.fontSize) < 0.05 &&
        prev.text === next.text
      ) {
        return prev;
      }
      return next;
    });
  }, [sourceGrid]);

  const scheduleRefit = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      refit();
    });
  }, [refit]);

  useLayoutEffect(() => {
    metricsRef.current = null;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAnimateResize(!mq.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setAnimateResize(!e.matches);
    };
    mq.addEventListener("change", onMotionChange);

    scheduleRefit();

    const container = containerRef.current;
    if (!container) {
      mq.removeEventListener("change", onMotionChange);
      return;
    }

    const ro = new ResizeObserver(() => scheduleRefit());
    ro.observe(container);

    window.addEventListener("resize", scheduleRefit);

    void document.fonts.ready.then(() => {
      metricsRef.current = null;
      scheduleRefit();
    });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", scheduleRefit);
      mq.removeEventListener("change", onMotionChange);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scheduleRefit, content]);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-0 w-full overflow-hidden"
    >
      <pre
        ref={measureRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 m-0 whitespace-pre font-mono leading-none opacity-0"
        style={{ fontSize: `${REF_FONT_SIZE}px` }}
      />
      <pre
        className="absolute left-0 top-0 m-0 whitespace-pre font-mono leading-none text-red"
        style={{
          fontSize: layout ? `${layout.fontSize}px` : `${REF_FONT_SIZE}px`,
          lineHeight: 1,
          transition: animateResize ? "font-size 0.15s ease-out" : undefined,
        }}
      >
        {layout?.text ?? fallbackText}
      </pre>
    </div>
  );
}
