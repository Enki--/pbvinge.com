import { getCollection } from 'astro:content';
import { isPublishedPlannedBook, normalizeTags } from '../utils/books';
import { contributorNames } from '../utils/citations';

export interface FutureRead {
  title: string;
  author: string[];
  class: string;
  status: string;
  coverImage: string;
  tags: string[];
  slug: string;
  notes: string;
}

export async function getFutureReads(): Promise<FutureRead[]> {
  const books = await getCollection('books', ({ data }) => isPublishedPlannedBook(data));
  return books.sort((a, b) => a.data.title.localeCompare(b.data.title) || a.slug.localeCompare(b.slug)).map(book => ({
    title: book.data.title,
    author: contributorNames(book.data),
    class: book.data.class || '',
    status: book.data.status || 'to read',
    coverImage: book.data.cover,
    tags: normalizeTags(book.data.tags),
    slug: book.slug,
    notes: book.data.notes || '',
  }));
}
