import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { legacyContentId } from './utils/contentId';
import { normalizePublicationDate } from './utils/dates';

const publicationDate = z.union([z.number(), z.string(), z.date()]).transform((value, context) => {
  const normalized = normalizePublicationDate(value);
  if (normalized === undefined) {
    context.addIssue({ code: 'custom', message: 'Use a publication year, YYYY-MM, or an ISO date.' });
    return z.NEVER;
  }
  return normalized;
});

const contributor = z.union([
  z.object({ family: z.string().min(1), given: z.string().optional(), suffix: z.string().optional() }),
  z.object({ literal: z.string().min(1) }),
]);

export const collections = {
  books: defineCollection({
    loader: glob({
      base: './src/content/books',
      pattern: ['**/*.{md,mdx}', '!**/_*/**', '!**/_*.{md,mdx}'],
      generateId: legacyContentId,
      retainBody: true,
    }),
    schema: z.object({
      tags: z.array(z.string()),
      title: z.string(),
      subtitle: z.string().optional(),
      author: z.array(z.string()),
      citation: z.object({
        authors: z.array(contributor).optional(),
        editors: z.array(contributor).optional(),
        translators: z.array(contributor).optional(),
        title: z.string().optional(),
        apaTitle: z.string().optional(),
        edition: z.string().optional(),
        originalYear: z.number().int().positive().optional(),
      }).optional(),
      category: z.array(z.string()).optional(),
      publisher: z.string().optional(),
      publish: publicationDate.optional(),
      pages: z.number().optional(),
      isbn10: z.string().optional(),
      isbn13: z.string().optional(),
      cover: z.string(),
      status: z.string()
        .transform((val) => val.toLowerCase())
        .pipe(z.enum(["to read", "reading", "complete", "tbr", "tbd"]))
        .optional(),
      created: z.coerce.date().optional(),
      updated: z.coerce.date().optional(),
      class: z.string().optional(),
      sequence: z.any().optional(),
      notes: z.string().optional(),
      summary: z.string().optional(),
      isPublished: z.boolean().default(true),
      dateCompleted: z.string().optional(),
      coverImage: z.string().optional()
    }),
  }),

  // Historic documents collection
  documents: defineCollection({
    loader: glob({
      base: './src/content/documents',
      pattern: ['**/*.{md,mdx}', '!**/_*/**', '!**/_*.{md,mdx}'],
      generateId: legacyContentId,
      retainBody: true,
    }),
    schema: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      authors: z.array(z.string()).optional(),
      origin: z.string().optional(),
      date: publicationDate.optional(),
      tags: z.array(z.string()).default([]),
      cover: z.string().optional(),
      externalUrl: z.url().optional(),
      isPublished: z.boolean().default(true),
      created: z.coerce.date().optional(),
      updated: z.coerce.date().optional()
    })
  })
};
