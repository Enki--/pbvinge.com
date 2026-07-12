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
  const futureReadsCollection = await getCollection('futureReads');

  return futureReadsCollection.sort((a, b) => a.id.localeCompare(b.id)).map(book => ({
    title: book.data.title,
    author: book.data.author,
    class: book.data.class,
    dateCompleted: book.data.dateCompleted,
    coverImage: book.data.coverImage,
    tags: book.data.tags || [],
    slug: book.slug,
    notes: book.data.notes
  }));
}
