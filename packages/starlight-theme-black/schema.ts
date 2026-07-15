import { z } from 'astro/zod'

export const ExtendDocsSchema = z.object({
  hero: z
    .object({
      layout: z
        .enum(['centered', 'media-top', 'media-left', 'media-right', 'banner'])
        .default('media-left'),
      announcement: z
        .object({
          text: z.string(),
          link: z.string(),
        })
        .optional(),
    })
    .optional(),
})
