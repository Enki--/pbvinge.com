export type PublicationDate = string | Date | number;

/** Calendar dates and year-only values must never become millisecond timestamps. */
export function normalizePublicationDate(value: unknown): string | Date | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') {
    return Number.isInteger(value) && value >= 1 && value <= 9999
      ? String(value).padStart(4, '0') : undefined;
  }
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : undefined;
  if (typeof value !== 'string') return undefined;
  const text = value.trim();
  if (/^0000(?:-|$)/.test(text)) return undefined;
  if (/^\d{4}$/.test(text) && Number(text) > 0) return text;
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(text)) return text;
  if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(text)) return undefined;
  const date = new Date(text);
  if (!Number.isFinite(date.getTime())) return undefined;
  // Reject dates such as February 31, which JavaScript otherwise rolls forward.
  const calendar = text.slice(0, 10);
  const calendarDate = new Date(`${calendar}T00:00:00Z`);
  if (!Number.isFinite(calendarDate.getTime()) || calendarDate.toISOString().slice(0, 10) !== calendar) return undefined;
  return text;
}

export function publicationYear(value?: PublicationDate): string {
  const date = normalizePublicationDate(value);
  if (typeof date === 'string') return date.slice(0, 4);
  return date ? String(date.getUTCFullYear()) : '';
}

export function formatCalendarDate(
  value?: PublicationDate,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  const normalized = normalizePublicationDate(value);
  if (!normalized) return '';
  if (typeof normalized === 'string' && /^\d{4}$/.test(normalized)) return normalized;
  const monthOnly = typeof normalized === 'string' && /^\d{4}-\d{2}$/.test(normalized);
  const date = normalized instanceof Date ? normalized : new Date(monthOnly ? `${normalized}-01` : normalized);
  const precisionOptions = monthOnly ? { ...options, day: undefined } : options;
  return date.toLocaleDateString('en-US', { ...precisionOptions, timeZone: 'UTC' });
}

export function timestampValue(value?: string | Date): number {
  if (!value) return 0;
  const milliseconds = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(milliseconds) ? milliseconds : 0;
}
