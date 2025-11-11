// Utility functions for timeline

export function parseDate(input: string): number {
  // Returns a timestamp for sorting
  return new Date(input).getTime();
}

export function sortEvents(events: any[]): any[] {
  return events.slice().sort((a, b) => {
    const aDate = a.date || a.dateRange?.[0];
    const bDate = b.date || b.dateRange?.[0];
    return parseDate(aDate) - parseDate(bDate);
  });
}

export function formatRange(start: string, end?: string): string {
  if (!end || start.slice(0,4) === end.slice(0,4)) return start.slice(0,4);
  return `${start.slice(0,4)}–${end.slice(0,4)}`;
}
