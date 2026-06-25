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
});

function monthKey(year: number, month: number): string {
  return `${year}-${month}`;
}

function monthLabel(year: number, month: number): string {
  return MONTH_FORMAT.format(new Date(year, month, 1));
}

function sortPostsNewestFirst(posts: SignalPreview[]): SignalPreview[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function groupSignalsByDate(
  posts: SignalPreview[],
  now = new Date(),
): LedgerGroup[] {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const sorted = sortPostsNewestFirst(posts);

  const byMonth = new Map<string, SignalPreview[]>();
  for (const post of sorted) {
    const d = new Date(post.date);
    const key = monthKey(d.getFullYear(), d.getMonth());
    const bucket = byMonth.get(key);
    if (bucket) bucket.push(post);
    else byMonth.set(key, [post]);
  }

  const groups: LedgerGroup[] = [];
  const years = [
    ...new Set(
      sorted.map((post) => new Date(post.date).getFullYear()),
    ),
  ].sort((a, b) => b - a);

  for (const year of years) {
    const monthIndices = [
      ...new Set(
        sorted
          .filter((post) => new Date(post.date).getFullYear() === year)
          .map((post) => new Date(post.date).getMonth()),
      ),
    ].sort((a, b) => b - a);

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

export function collectGroupKeys(groups: LedgerGroup[]): string[] {
  const keys: string[] = [];
  for (const group of groups) {
    if (group.kind === "month") keys.push(group.key);
    if (group.kind === "year") {
      keys.push(group.key);
      for (const month of group.months) keys.push(month.key);
    }
  }
  return keys;
}

export function collectPostsInGroup(group: LedgerGroup): SignalPreview[] {
  if (group.kind === "current-month") return group.posts;
  if (group.kind === "month") return group.posts;
  return group.months.flatMap((month) => month.posts);
}
