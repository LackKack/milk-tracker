function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Formats a Date as a local 'YYYY-MM-DD' string (no UTC conversion). */
export function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Formats a Date as a local 'HH:mm' string (no UTC conversion). */
export function formatTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function today(): string {
  return formatDate(new Date());
}

export function nowTime(): string {
  return formatTime(new Date());
}

/** Parses a 'YYYY-MM-DD' string into a local Date at midnight. */
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

/**
 * Shifts a 'YYYY-MM-DD' date by whole calendar months, clamping the day to
 * the target month's length (e.g. Mar 31 - 1 month -> Feb 28/29) instead of
 * overflowing into the following month the way plain setMonth() would.
 */
export function addMonthsToDate(dateStr: string, delta: number): string {
  const d = parseDate(dateStr);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + delta);
  const daysInTargetMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, daysInTargetMonth));
  return formatDate(d);
}

export function formatDateForDisplay(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Short form for chart axis labels, e.g. 'Oct 5' (no year). */
export function formatDateShort(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

/** Every date from `from` to `to` inclusive, ascending. */
export function datesBetween(from: string, to: string): string[] {
  const dates: string[] = [];
  for (let cursor = from; cursor <= to; cursor = addDays(cursor, 1)) {
    dates.push(cursor);
  }
  return dates;
}

export function formatTimeForDisplay(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date(2000, 0, 1, hours, minutes);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
