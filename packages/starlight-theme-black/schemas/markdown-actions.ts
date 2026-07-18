import { z } from 'astro/zod'

export const MarkdownActionsAgentSchema = z.union([
  z.boolean(),
  z.object({
    label: z.string().optional(),
    url: z.string().optional(),
    prompt: z.string().optional(),
    icon: z.string().optional(),
  }),
])

export type MarkdownActionsAgent = z.infer<typeof MarkdownActionsAgentSchema>

export const MarkdownActionsAgentsSchema = z
  .object({
    chatgpt: MarkdownActionsAgentSchema.optional(),
    v0: MarkdownActionsAgentSchema.optional(),
    claude: MarkdownActionsAgentSchema.optional(),
    scira: MarkdownActionsAgentSchema.optional(),
  })
  .catchall(MarkdownActionsAgentSchema.optional())

export type MarkdownActionsAgents = z.infer<typeof MarkdownActionsAgentsSchema>

export const MarkdownActionsSchema = z.union([
  z.boolean(),
  z.object({
    prompt: z.string().optional(),
    agents: MarkdownActionsAgentsSchema.optional(),
  }),
])

export type MarkdownActions = z.infer<typeof MarkdownActionsSchema>

/**
 * Tipo interno normalizado.
 * El usuario nunca interactúa con él; se usa después de resolver
 * la configuración global + frontmatter.
 */
export interface NormalizedMarkdownActions {
  enabled: boolean
  prompt: string
  agents: Map<string, MarkdownActionsAgent>
}

export interface ResolvedAgent {
  id: string
  label: string
  url: string
  prompt: string
  icon: string
}
