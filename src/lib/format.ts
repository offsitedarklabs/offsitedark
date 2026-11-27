export function formatDate(dateStr: string | Date) {
  let year: number;
  let month: number;
  let day: number;

  if (dateStr instanceof Date && !Number.isNaN(dateStr.getTime())) {
    year = dateStr.getUTCFullYear();
    month = dateStr.getUTCMonth();
    day = dateStr.getUTCDate();
  } else {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(dateStr));
    if (match) {
      year = Number(match[1]);
      month = Number(match[2]) - 1;
      day = Number(match[3]);
    } else {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    }
  }

  return new Date(Date.UTC(year, month, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
