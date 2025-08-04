import { getCollection } from 'astro:content';

export interface FutureRead {
  title: string;
  author: string[];
  class: string;
  dateCompleted: string;
  coverImage: string;
  tags?: string[];
  slug?: string;
  notes?: string;
}

export async function getFutureReads(): Promise<FutureRead[]> {
  const booksCollection = await getCollection('books');
  
  // Filter books that are not complete (to read, reading, tbr, tbd)
  const futureReads = booksCollection.filter(book => {
    const status = book.data.status?.toLowerCase();
    return status && ['to read', 'reading', 'tbr', 'tbd'].includes(status);
  });
  
  // Convert to FutureRead format
  return futureReads.map(book => ({
    title: book.data.title,
    author: book.data.author,
    class: book.data.class || '',
    dateCompleted: book.data.dateCompleted || book.data.status || 'TBR',
    coverImage: book.data.coverImage || book.data.cover,
    tags: book.data.tags || [],
    slug: book.slug,
    notes: book.data.notes
  }));
}