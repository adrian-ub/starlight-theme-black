import { z } from 'astro/zod'

export const ExtendDocsSchema = z.object({
  links: z.object({
    doc: z.string().optional(),
    api: z.string().optional(),
  }).optional(),
})
