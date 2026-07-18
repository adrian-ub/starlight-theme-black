import { z } from 'astro/zod'

export const MarkdownActionsServiceSchema = z.object({
  name: z.string(),
  url: z.string(),
  icon: z.string(),
})

export type MarkdownActionsService = z.infer<typeof MarkdownActionsServiceSchema>

export const MarkdownActionsFrontmatterSchema = z.union([
  z.boolean(),
  z.object({
    prompt: z.string().optional(),
    services: z.array(z.string()).optional(),
  }),
])

export type MarkdownActionsFrontmatter = z.infer<typeof MarkdownActionsFrontmatterSchema>
