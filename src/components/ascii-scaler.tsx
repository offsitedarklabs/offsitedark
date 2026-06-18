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
  /** Preserve aspect ratio; width-bound on narrow viewports, height-bound on wide. */
  sizeToContent?: boolean;
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
  width: number;
  height: number;
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

function rowsForCols(srcRows: number, srcCols: number, cols: number): number {
  return Math.max(1, Math.min(MAX_ROWS, Math.round((cols * srcRows) / srcCols)));
}

function colsForRows(srcRows: number, srcCols: number, rows: number): number {
  return Math.max(1, Math.min(MAX_COLS, Math.round((rows * srcCols) / srcRows)));
}

function computeLayoutFill(
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
    width: cols * fontSize * unitWidth,
    height: rows * fontSize * unitHeight,
  };
}

const NARROW_MQ = "(max-width: 767px)";

function isNarrowViewport(): boolean {
  return window.matchMedia(NARROW_MQ).matches;
}

function computeLayoutContainWidthBound(
  cw: number,
  metrics: CharMetrics,
  source: string[][],
): Layout | null {
  if (cw <= 0) return null;

  const srcRows = source.length;
  const srcCols = source[0]?.length ?? 1;
  const { unitWidth, unitHeight } = metrics;
  const refCharW = REF_FONT_SIZE * unitWidth;

  const maxColsByWidth = Math.max(
    1,
    Math.min(MAX_COLS, Math.floor(cw / refCharW)),
  );

  let cols = maxColsByWidth;
  let rows = rowsForCols(srcRows, srcCols, cols);
  let fontSize = fitFontSize(
    cw,
    Number.POSITIVE_INFINITY,
    cols,
    rows,
    unitWidth,
    unitHeight,
  );

  while (cols < MAX_COLS && rows < MAX_ROWS) {
    const nextCols = cols + 1;
    const nextRows = rowsForCols(srcRows, srcCols, nextCols);
    const nextFs = fitFontSize(
      cw,
      Number.POSITIVE_INFINITY,
      nextCols,
      nextRows,
      unitWidth,
      unitHeight,
    );
    if (
      nextFs >= MIN_FONT_SIZE &&
      nextCols * nextFs * unitWidth <= cw + 0.5 &&
      nextFs >= fontSize * 0.99
    ) {
      cols = nextCols;
      rows = nextRows;
      fontSize = nextFs;
    } else {
      break;
    }
  }

  fontSize = Math.max(
    MIN_FONT_SIZE,
    fitFontSize(cw, Number.POSITIVE_INFINITY, cols, rows, unitWidth, unitHeight),
  );

  const resampled = resampleGrid(source, cols, rows);
  return {
    cols,
    rows,
    fontSize,
    text: gridToString(resampled),
    width: cols * fontSize * unitWidth,
    height: rows * fontSize * unitHeight,
  };
}

function computeLayoutContainHeightBound(
  ch: number,
  metrics: CharMetrics,
  source: string[][],
): Layout | null {
  if (ch <= 0) return null;

  const srcRows = source.length;
  const srcCols = source[0]?.length ?? 1;
  const { unitWidth, unitHeight } = metrics;
  const refCharH = REF_FONT_SIZE * unitHeight;

  const maxRowsByHeight = Math.max(
    1,
    Math.min(MAX_ROWS, Math.floor(ch / refCharH)),
  );

  let rows = maxRowsByHeight;
  let cols = colsForRows(srcRows, srcCols, rows);
  let fontSize = fitFontSize(
    Number.POSITIVE_INFINITY,
    ch,
    cols,
    rows,
    unitWidth,
    unitHeight,
  );

  while (rows < MAX_ROWS && cols < MAX_COLS) {
    const nextRows = rows + 1;
    const nextCols = colsForRows(srcRows, srcCols, nextRows);
    const nextFs = fitFontSize(
      Number.POSITIVE_INFINITY,
      ch,
      nextCols,
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
      cols = nextCols;
      fontSize = nextFs;
    } else {
      break;
    }
  }

  fontSize = Math.max(
    MIN_FONT_SIZE,
    fitFontSize(Number.POSITIVE_INFINITY, ch, cols, rows, unitWidth, unitHeight),
  );

  const resampled = resampleGrid(source, cols, rows);
  return {
    cols,
    rows,
    fontSize,
    text: gridToString(resampled),
    width: cols * fontSize * unitWidth,
    height: rows * fontSize * unitHeight,
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

export function AsciiScaler({ content, sizeToContent = false }: AsciiScalerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLPreElement>(null);
  const rafRef = useRef<number | null>(null);
  const metricsRef = useRef<CharMetrics | null>(null);

  const [layout, setLayout] = useState<Layout | null>(null);
  const [animateResize, setAnimateResize] = useState(false);
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== "undefined" && isNarrowViewport(),
  );

  const sourceGrid = useMemo(() => parseAsciiGrid(content), [content]);
  const fallbackText = useMemo(() => gridToString(sourceGrid), [sourceGrid]);

  const refit = useCallback(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    if (!metricsRef.current) {
      metricsRef.current = measureCharMetrics(measure);
    }

    const metrics = metricsRef.current;
    if (!metrics) return;

    let next: Layout | null;

    if (sizeToContent) {
      const parent = container.parentElement;
      const narrow = isNarrowViewport();

      if (narrow) {
        const cw = parent?.clientWidth ?? container.clientWidth;
        if (cw === 0) return;
        next = computeLayoutContainWidthBound(cw, metrics, sourceGrid);
      } else {
        const ch = parent?.clientHeight ?? container.clientHeight;
        if (ch === 0) return;
        next = computeLayoutContainHeightBound(ch, metrics, sourceGrid);
      }
    } else {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw === 0 || ch === 0) return;
      next = computeLayoutFill(cw, ch, metrics, sourceGrid);
    }

    if (!next) return;

    setLayout((prev) => {
      if (
        prev &&
        prev.cols === next.cols &&
        prev.rows === next.rows &&
        Math.abs(prev.fontSize - next.fontSize) < 0.05 &&
        Math.abs(prev.width - next.width) < 0.5 &&
        Math.abs(prev.height - next.height) < 0.5 &&
        prev.text === next.text
      ) {
        return prev;
      }
      return next;
    });
  }, [sourceGrid, sizeToContent]);

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

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAnimateResize(!motionMq.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setAnimateResize(!e.matches);
    };
    motionMq.addEventListener("change", onMotionChange);

    const narrowMq = window.matchMedia(NARROW_MQ);
    setIsNarrow(narrowMq.matches);
    const onNarrowChange = (e: MediaQueryListEvent) => {
      setIsNarrow(e.matches);
      scheduleRefit();
    };
    narrowMq.addEventListener("change", onNarrowChange);

    scheduleRefit();

    const container = containerRef.current;
    if (!container) {
      motionMq.removeEventListener("change", onMotionChange);
      narrowMq.removeEventListener("change", onNarrowChange);
      return;
    }

    const resizeTarget =
      sizeToContent && container.parentElement
        ? container.parentElement
        : container;

    const ro = new ResizeObserver(() => scheduleRefit());
    ro.observe(resizeTarget);

    window.addEventListener("resize", scheduleRefit);

    void document.fonts.ready.then(() => {
      metricsRef.current = null;
      scheduleRefit();
    });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", scheduleRefit);
      motionMq.removeEventListener("change", onMotionChange);
      narrowMq.removeEventListener("change", onNarrowChange);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scheduleRefit, content, sizeToContent]);

  const narrowContain = sizeToContent && isNarrow;

  return (
    <div
      ref={containerRef}
      className={
        sizeToContent
          ? narrowContain
            ? "relative w-full shrink-0 overflow-hidden"
            : "relative h-full min-h-0 shrink-0 overflow-hidden"
          : "relative h-full min-h-0 w-full overflow-hidden"
      }
      style={
        sizeToContent && layout
          ? narrowContain
            ? { height: `${Math.ceil(layout.height)}px` }
            : { width: `${Math.ceil(layout.width)}px` }
          : undefined
      }
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
