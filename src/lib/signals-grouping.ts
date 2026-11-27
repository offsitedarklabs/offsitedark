import type { SignalPreview } from "@/lib/post";

export type MonthLedgerGroup = {
  kind: "month";
  key: string;
  label: string;
  posts: SignalPreview[];
};

export type YearLedgerGroup = {
  kind: "year";
  key: string;
  label: string;
  months: MonthLedgerGroup[];
};

export type CurrentMonthLedgerGroup = {
  kind: "current-month";
  posts: SignalPreview[];
};

export type LedgerGroup =
  | CurrentMonthLedgerGroup
  | MonthLedgerGroup
  | YearLedgerGroup;

const MONTH_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function parseYearMonth(dateInput: string | Date): {
  year: number;
  month: number;
} {
  if (dateInput instanceof Date && !Number.isNaN(dateInput.getTime())) {
    return {
      year: dateInput.getUTCFullYear(),
      month: dateInput.getUTCMonth(),
    };
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(dateInput));
  if (match) {
    return {
      year: Number(match[1]),
      month: Number(match[2]) - 1,
    };
  }
  const parsed = new Date(dateInput);
  return {
    year: parsed.getUTCFullYear(),
    month: parsed.getUTCMonth(),
  };
}

function monthKey(year: number, month: number): string {
  return `${year}-${month}`;
}

function monthLabel(year: number, month: number): string {
  return MONTH_FORMAT.format(new Date(Date.UTC(year, month, 1)));
}

function sortPostsNewestFirst(posts: SignalPreview[]): SignalPreview[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function groupSignalsByDate(
  posts: SignalPreview[],
  referenceDate: string | Date = new Date(),
): LedgerGroup[] {
  const { year: currentYear, month: currentMonth } =
    parseYearMonth(referenceDate);
  const sorted = sortPostsNewestFirst(posts);

  const byMonth = new Map<string, SignalPreview[]>();
  const monthsByYear = new Map<number, Set<number>>();
  for (const post of sorted) {
    const { year, month } = parseYearMonth(post.date);
    if (!Number.isFinite(year) || !Number.isFinite(month)) continue;
    const key = monthKey(year, month);
    const bucket = byMonth.get(key);
    if (bucket) bucket.push(post);
    else byMonth.set(key, [post]);

    const monthSet = monthsByYear.get(year);
    if (monthSet) monthSet.add(month);
    else monthsByYear.set(year, new Set([month]));
  }

  const groups: LedgerGroup[] = [];
  const years = [...monthsByYear.keys()].sort((a, b) => b - a);

  for (const year of years) {
    const monthIndices = [...(monthsByYear.get(year) ?? [])].sort(
      (a, b) => b - a,
    );

    if (year === currentYear) {
      for (const month of monthIndices) {
        const key = monthKey(year, month);
        const monthPosts = byMonth.get(key) ?? [];
        if (month === currentMonth) {
          groups.push({ kind: "current-month", posts: monthPosts });
        } else {
          groups.push({
            kind: "month",
            key: `month:${key}`,
            label: monthLabel(year, month),
            posts: monthPosts,
          });
        }
      }
      continue;
    }

    const months: MonthLedgerGroup[] = monthIndices.map((month) => {
      const key = monthKey(year, month);
      return {
        kind: "month",
        key: `month:${key}`,
        label: monthLabel(year, month),
        posts: byMonth.get(key) ?? [],
      };
    });

    groups.push({
      kind: "year",
      key: `year:${year}`,
      label: String(year),
      months,
    });
  }

  return groups;
}

export function collectGroupKeys(groups: LedgerGroup[]): Record<string, boolean> {
  const keys: Record<string, boolean> = {};
  for (const group of groups) {
    if (group.kind === "month" || group.kind === "year") {
      keys[group.key] = true;
    }
    if (group.kind === "year") {
      for (const month of group.months) keys[month.key] = true;
    }
  }
  return keys;
}

export function collectPostsInGroup(group: LedgerGroup): SignalPreview[] {
  if (group.kind === "current-month") return group.posts;
  if (group.kind === "month") return group.posts;
  return group.months.flatMap((month) => month.posts);
}
