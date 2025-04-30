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
      publish: z.string().optional(),
      pages: z.number().optional(),
      isbn10: z.string().optional(),
      isbn13: z.string().optional(),
      cover: z.string(),
      status: z.enum(["to read", "reading", "complete"]).optional(),
      created: z.string().optional(),
      updated: z.string().optional(),
      class: z.string().optional(),
      sequence: z.any().optional(),
      slug: z.string().optional(),
      isPublished: z.boolean().default(true)
    }),
  }),
  
  futureReads: defineCollection({
    type: 'content',
    schema: z.object({
      books: z.array(z.object({
        title: z.string(),
        author: z.string(),
        class: z.string(),
        dateCompleted: z.string(),
        coverImage: z.string(),
        tags: z.array(z.string()).optional(),
        reason: z.string().optional()
      }))
    })
  })
};