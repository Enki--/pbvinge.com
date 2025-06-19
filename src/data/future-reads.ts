import { getCollection } from 'astro:content';

export interface FutureRead {
  title: string;
  author: string[];
  class: string;
  dateCompleted: string;
  coverImage: string;
  tags?: string[];
  slug?: string;
}

export async function getFutureReads(): Promise<FutureRead[]> {
  const futureReadsEntry = await getCollection('futureReads');
  // Get the data from the index.md file in the futureReads collection
  if (futureReadsEntry.length === 0) {
    return [];
  }
  return futureReadsEntry[0].data.books;
}