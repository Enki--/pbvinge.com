import { defineCollection, z } from 'astro:content';

export const collections = {
  books: defineCollection({
    type: 'content',
    schema: z.object({
      // Citation metadata
      citekey: z.string().optional(),
      aliases: z.array(z.string()).optional(),
      title: z.string(),
      authors: z.array(z.string()),
      year: z.number(),
      itemType: z.string().optional(),
      publisher: z.string().optional(),
      isbn: z.string().optional(),
      
      // Website display metadata
      rating: z.number().min(1).max(5),
      coverImage: z.string(),
      dateCompleted: z.string(),
      tags: z.array(z.string()),
      class: z.string(),
      summary: z.string().optional(),
      isPublished: z.boolean().default(true),
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