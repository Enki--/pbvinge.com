// Utility functions for timeline
export type TimelineEvent = {
  date?: string;
  dateRange?: [string, string];
};

export function parseDate(input: string | Date | number): number {
  // Returns a timestamp for sorting
  return new Date(input).getTime();
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function sortEvents<T extends TimelineEvent>(events: T[]): T[] {
  return events.slice().sort((a, b) => {
    const aDate = a.date || a.dateRange?.[0];
    const bDate = b.date || b.dateRange?.[0];
    return parseDate(aDate || 0) - parseDate(bDate || 0);
  });
}

export function formatRange(start: string, end?: string): string {
  if (!end || start.slice(0,4) === end.slice(0,4)) return start.slice(0,4);
  return `${start.slice(0,4)}–${end.slice(0,4)}`;
}

export function formatMonthYear(date: string | Date): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return `${MONTHS[parsed.getUTCMonth()]} ${parsed.getUTCFullYear()}`;
}

export function formatDetailedRange(start: string | Date, end?: string | Date): string {
  if (!end) return formatMonthYear(start);
  return `${formatMonthYear(start)} – ${formatMonthYear(end)}`;
}
