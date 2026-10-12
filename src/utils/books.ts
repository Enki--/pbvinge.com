import { formatCalendarDate, timestampValue, type PublicationDate } from './dates';

export type BookStatus = "complete" | "reading" | "to read" | "tbr" | "tbd" | string;

interface PublicationState { isPublished?: boolean; status?: string; }

export function isPublishedBookNote(data: PublicationState): boolean {
  return data.isPublished !== false && data.status?.trim().toLowerCase() === 'complete';
}

export function isPublishedPlannedBook(data: PublicationState): boolean {
  return data.isPublished !== false && ['reading', 'to read', 'tbr', 'tbd'].includes(data.status?.trim().toLowerCase() ?? '');
}

export function compareBookRecency(
  a: { id: string; data: { created?: Date; updated?: Date } },
  b: { id: string; data: { created?: Date; updated?: Date } },
): number {
  return timestampValue(b.data.created ?? b.data.updated) - timestampValue(a.data.created ?? a.data.updated)
    || a.id.localeCompare(b.id);
}

export function normalizeAuthors(author: unknown): string[] {
  if (Array.isArray(author)) return author.filter(Boolean).map(String);
  if (!author) return [];
  return [String(author)];
}

export function normalizeTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.filter(Boolean).map(String);
  return [];
}

export function normalizeCategories(category: unknown): string[] {
  if (Array.isArray(category)) return category.filter(Boolean).map(String);
  return [];
}

export function getStatusColor(status?: BookStatus): string {
  switch (status?.toLowerCase()) {
    case "complete":
      return "bg-green-100 text-green-800";
    case "reading":
      return "bg-blue-100 text-blue-800";
    case "to read":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function formatLongDate(date?: PublicationDate): string {
  return formatCalendarDate(date);
}

export function buildBookSearchString(input: {
  slug?: string;
  title?: string;
  subtitle?: string;
  authors?: string[];
  categories?: string[];
  tags?: string[];
  className?: string;
  status?: string;
  summary?: string;
  notes?: string;
}): string {
  const searchPieces = [
    input.slug,
    input.title,
    input.subtitle,
    input.authors?.join(" "),
    input.categories?.join(" "),
    input.tags?.join(" "),
    input.className,
    input.status,
    input.summary,
    input.notes,
  ].filter(Boolean);

  return searchPieces.join(" ").toLowerCase();
}
