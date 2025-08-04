import { defineCollection, z } from 'astro:content';

export const collections = {
  books: defineCollection({
    type: 'content',
    schema: z.object({
      tags: z.array(z.string()),
      title: z.string(),
      subtitle: z.string().optional(),
      author: z.array(z.string()),
      category: z.array(z.string()).optional(),
      publisher: z.string().optional(),
      publish: z.coerce.date().optional(),
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
      isPublished: z.boolean().default(true),
      dateCompleted: z.string().optional(),
      coverImage: z.string().optional()
    }),
  }),
  
  futureReads: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      author: z.array(z.string()),
      class: z.string(),
      dateCompleted: z.string(),
      coverImage: z.string(),
      tags: z.array(z.string()).optional(),
      slug: z.string().optional(),
      notes: z.string().optional()
    })
  })
};