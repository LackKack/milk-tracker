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

/** 'YYYY-MM' for the given 'YYYY-MM-DD' date string. */
export function toYearMonth(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export function currentYearMonth(): string {
  return toYearMonth(today());
}

export function addMonths(yearMonth: string, delta: number): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function monthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function firstDayOfMonth(yearMonth: string): string {
  return `${yearMonth}-01`;
}

export function lastDayOfMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const d = new Date(year, month, 0); // day 0 of next month = last day of this month
  return formatDate(d);
}

export interface MonthGridCell {
  date: string | null; // null for leading/trailing blank cells
  isCurrentMonth: boolean;
}

/**
 * Builds a 7-column grid of day cells for a given 'YYYY-MM' month, padded
 * with blank cells so the first day aligns under the correct weekday column
 * (Sunday-first) and the grid always ends on a full week.
 */
export function buildMonthGrid(yearMonth: string): MonthGridCell[] {
  const first = parseDate(firstDayOfMonth(yearMonth));
  const last = parseDate(lastDayOfMonth(yearMonth));
  const leadingBlanks = first.getDay();
  const daysInMonth = last.getDate();

  const cells: MonthGridCell[] = [];
  for (let i = 0; i < leadingBlanks; i++) {
    cells.push({ date: null, isCurrentMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: `${yearMonth}-${pad(day)}`, isCurrentMonth: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: null, isCurrentMonth: false });
  }
  return cells;
}

export function formatDateForDisplay(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeForDisplay(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date(2000, 0, 1, hours, minutes);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}
