import { z } from 'astro/zod'
import { MarkdownActionsSchema } from './schemas/markdown-actions'

export const ExtendDocsSchema = z.object({
  hero: z
    .object({
      layout: z
        .enum(['centered', 'media-top', 'media-left', 'media-right', 'banner'])
        .default('centered'),
      announcement: z
        .object({
          text: z.string(),
          link: z.string(),
        })
        .optional(),
    })
    .optional(),
  showMarkdownActions: MarkdownActionsSchema.optional(),
})
