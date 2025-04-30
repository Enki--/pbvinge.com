import { getCollection } from 'astro:content';

export interface FutureRead {
  title: string;
  author: string;
  class: string;
  dateCompleted: string;
  coverImage: string;
  tags?: string[];
  reason?: string;
}

export async function getFutureReads(): Promise<FutureRead[]> {
  const futureReadsEntry = await getCollection('futureReads');
  // Since we now have a single markdown file, we get the first (and only) entry
  return futureReadsEntry[0].data.books;
}