import { publicationYear, type PublicationDate } from './dates';
import nameOverrides from '../data/citation-names.json';
import titleOverrides from '../data/citation-titles.json';

export type Contributor = { family: string; given?: string; suffix?: string } | { literal: string };
export interface BookMetadata {
  title: string;
  subtitle?: string;
  author: string[];
  publisher?: string;
  publish?: PublicationDate;
  isbn10?: string;
  isbn13?: string;
  citation?: {
    authors?: Contributor[];
    editors?: Contributor[];
    translators?: Contributor[];
    title?: string;
    apaTitle?: string;
    edition?: string;
    originalYear?: number;
  };
}
export type CitationFormat = 'bibtex' | 'apa' | 'mla';
export interface CitationPart { text: string; italic?: boolean }

/** Explicit names take precedence; do not guess how commas or compound surnames split. */
function parseName(name: string): Contributor {
  const text = name.trim();
  const override = (nameOverrides as Record<string, Contributor>)[text];
  if (override) return override;
  if (text.includes(',')) return { literal: text };
  const words = text.split(/\s+/);
  if (words.length < 2) return { literal: text };
  return { family: words.pop()!, given: words.join(' ') };
}

export function citationAuthors(book: BookMetadata): Contributor[] {
  return book.citation?.authors ?? book.author.map(value => value.trim()).filter(Boolean).map(parseName);
}

function fullName(person: Contributor): string {
  if ('literal' in person) return person.literal;
  return [person.given, person.family, person.suffix].filter(Boolean).join(' ');
}
function invertedName(person: Contributor): string {
  if ('literal' in person) return person.literal;
  return `${person.family}${person.given ? `, ${person.given}` : ''}${person.suffix ? `, ${person.suffix}` : ''}`;
}
function initials(given = ''): string {
  return given.trim().split(/\s+/).filter(Boolean).map(word =>
    /^(?:\p{L}\.){2,}$/u.test(word)
      ? [...word.matchAll(/(\p{L})\./gu)].map(match => `${match[1].toLocaleUpperCase('en-US')}.`).join(' ')
      : word.split('-').filter(Boolean).map(part => `${Array.from(part)[0].toLocaleUpperCase('en-US')}.`).join('-')
  ).join(' ');
}
function apaName(person: Contributor): string {
  if ('literal' in person) return person.literal;
  return `${person.family}${person.given ? `, ${initials(person.given)}` : ''}${person.suffix ? `, ${person.suffix}` : ''}`;
}
function apaRoleName(person: Contributor): string {
  if ('literal' in person) return person.literal;
  return [initials(person.given), person.family, person.suffix].filter(Boolean).join(' ');
}
function joinNames(values: string[], conjunction: string): string {
  if (values.length < 2) return values[0] ?? '';
  if (values.length === 2) return values.join(` ${conjunction} `);
  return `${values.slice(0, -1).join(', ')}, ${conjunction} ${values.at(-1)}`;
}
function apaNames(people: Contributor[]): string {
  const values = people.map(apaName);
  if (values.length === 2) return `${values[0]}, & ${values[1]}`;
  return values.length > 20 ? `${values.slice(0, 19).join(', ')}, … ${values.at(-1)}` : joinNames(values, '&');
}
function mlaNames(people: Contributor[]): string {
  if (!people.length) return '';
  if (people.length > 2) return `${invertedName(people[0])}, et al.`;
  return people.length === 2 ? `${invertedName(people[0])}, and ${fullName(people[1])}` : invertedName(people[0]);
}
function sentence(text: string): string {
  return /[.!?]$/.test(text.trim()) ? text : `${text}.`;
}
function bookTitle(book: BookMetadata): string {
  return book.citation?.title ?? `${book.title}${book.subtitle ? `: ${book.subtitle.replace(/[.]$/, '')}` : ''}`;
}
function apaTitle(book: BookMetadata): string {
  const title = bookTitle(book);
  // Reviewed existing titles preserve proper nouns and acronyms. New records can
  // supply citation.apaTitle instead of having their names blindly lowercased.
  return book.citation?.apaTitle ?? (titleOverrides as Record<string, string>)[title] ?? title;
}

export function contributorCredit(book: BookMetadata): string {
  const authors = citationAuthors(book);
  const editors = book.citation?.editors ?? [];
  if (authors.length) return `by ${joinNames(authors.map(fullName), 'and')}`;
  return editors.length ? `edited by ${joinNames(editors.map(fullName), 'and')}` : '';
}

export function contributorNames(book: BookMetadata): string[] {
  const authors = citationAuthors(book);
  return (authors.length ? authors : book.citation?.editors ?? []).map(fullName);
}

function apaParts(book: BookMetadata): CitationPart[] {
  const authors = citationAuthors(book);
  const editors = book.citation?.editors ?? [];
  const translators = book.citation?.translators ?? [];
  const year = publicationYear(book.publish) || 'n.d.';
  const parts: CitationPart[] = [];
  if (authors.length || editors.length) {
    const primary = authors.length ? apaNames(authors) : `${apaNames(editors)} (${editors.length === 1 ? 'Ed.' : 'Eds.'})`;
    parts.push({ text: `${sentence(primary)} (${year}). ` }, { text: apaTitle(book), italic: true });
  } else {
    parts.push({ text: apaTitle(book), italic: true });
  }
  const details: string[] = [];
  if (authors.length && editors.length) details.push(`${joinNames(editors.map(apaRoleName), '&')}, ${editors.length === 1 ? 'Ed.' : 'Eds.'}`);
  if (translators.length) details.push(`${joinNames(translators.map(apaRoleName), '&')}, Trans.`);
  if (book.citation?.edition) details.push(book.citation.edition);
  parts.push({ text: details.length ? ` (${details.join('; ')}).`
    : (/[.!?]$/.test(apaTitle(book)) ? '' : '.') });
  if (!authors.length && !editors.length) parts.push({ text: ` (${year}).` });
  if (book.publisher) parts.push({ text: ` ${sentence(book.publisher)}` });
  if (book.citation?.originalYear) parts.push({ text: ` (Original work published ${book.citation.originalYear})` });
  return parts;
}
function mlaParts(book: BookMetadata): CitationPart[] {
  const authors = citationAuthors(book);
  const editors = book.citation?.editors ?? [];
  const translators = book.citation?.translators ?? [];
  const parts: CitationPart[] = [];
  if (authors.length) parts.push({ text: `${sentence(mlaNames(authors))} ` });
  else if (editors.length) parts.push({ text: `${sentence(`${mlaNames(editors)}, ${editors.length === 1 ? 'editor' : 'editors'}`)} ` });
  parts.push({ text: bookTitle(book), italic: true }, { text: /[.!?]$/.test(bookTitle(book)) ? ' ' : '. ' });
  const details: string[] = [];
  if (translators.length) details.push(`Translated by ${joinNames(translators.map(fullName), 'and')}`);
  if (authors.length && editors.length) details.push(`edited by ${joinNames(editors.map(fullName), 'and')}`);
  if (book.citation?.edition) details.push(book.citation.edition);
  if (book.publisher) details.push(book.publisher);
  const year = publicationYear(book.publish);
  if (year) details.push(year);
  if (details.length) parts.push({ text: sentence(details.join(', ')) });
  return parts;
}

/** Escape field delimiters and TeX metacharacters, including a literal backslash. */
export function escapeBibTeX(text: string): string {
  const replacements: Record<string, string> = {
    '\\': '\\textbackslash{}', '{': '\\{', '}': '\\}', '&': '\\&', '%': '\\%',
    '$': '\\$', '#': '\\#', '_': '\\_', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}',
  };
  return text.replace(/[\\{}&%$#_~^]/g, character => replacements[character]);
}
export function generateBibTeX(book: BookMetadata): string {
  const authors = citationAuthors(book);
  const editors = book.citation?.editors ?? [];
  const first = authors[0] ?? editors[0];
  const family = first ? ('literal' in first ? first.literal : first.family) : 'anonymous';
  const year = publicationYear(book.publish);
  const key = `${family}${year}${book.title.split(/\s+/)[0]}`.normalize('NFKD').replace(/[^A-Za-z0-9]/g, '').toLowerCase() || 'book';
  const fields: [string, string][] = [['title', escapeBibTeX(bookTitle(book))]];
  const bibNames = (people: Contributor[]) => people.map(person =>
    'literal' in person ? `{${escapeBibTeX(person.literal)}}`
      : escapeBibTeX([person.family, person.suffix, person.given].filter(Boolean).join(', '))
  ).join(' and ');
  if (authors.length) fields.push(['author', bibNames(authors)]);
  if (editors.length) fields.push(['editor', bibNames(editors)]);
  if (year) fields.push(['year', year]);
  if (book.publisher) fields.push(['publisher', escapeBibTeX(book.publisher)]);
  if (book.citation?.edition) {
    const ordinals: Record<string, string> = { '1st': 'First', '2nd': 'Second', '3rd': 'Third', '4th': 'Fourth', '5th': 'Fifth' };
    const edition = book.citation.edition.replace(/\s+ed\.$/, '').replace(/\brev\./g, 'revised')
      .replace(/^(?:1st|2nd|3rd|4th|5th)\b/, value => ordinals[value]);
    fields.push(['edition', escapeBibTeX(edition)]);
  }
  if (book.isbn13 || book.isbn10) fields.push(['isbn', escapeBibTeX(book.isbn13 || book.isbn10!)]);
  if (book.citation?.translators?.length) fields.push(['note', escapeBibTeX(`Translated by ${joinNames(book.citation.translators.map(fullName), 'and')}`)]);
  return `@book{${key},\n${fields.map(([field, value]) => `  ${field} = {${value}}`).join(',\n')}\n}`;
}
export function citationParts(book: BookMetadata, format: CitationFormat): CitationPart[] {
  if (format === 'apa') return apaParts(book);
  if (format === 'mla') return mlaParts(book);
  if (format === 'bibtex') return [{ text: generateBibTeX(book) }];
  throw new Error(`Unsupported citation format: ${format}`);
}
export function getCitation(book: BookMetadata, format: CitationFormat): string {
  return citationParts(book, format).map(part => part.text).join('').trim();
}
export const generateAPA = (book: BookMetadata): string => getCitation(book, 'apa');
export const generateMLA = (book: BookMetadata): string => getCitation(book, 'mla');
