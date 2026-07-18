import { z } from 'astro/zod'
import { NavbarItemSchema } from '../schemas/navbar'
import {
  MarkdownActionsSchema,
  type MarkdownActions,
  type MarkdownActionsAgent,
  type MarkdownActionsAgents,
  type NormalizedMarkdownActions,
  type ResolvedAgent,
} from '../schemas/markdown-actions'

const DEFAULT_PROMPT =
  "I'm looking at this documentation: {url}.\nHelp me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it."

const builtInAgents = new Map<
  string,
  Omit<ResolvedAgent, 'id' | 'prompt'>
>([
  [
    'chatgpt',
    {
      label: 'Open in ChatGPT',
      url: 'https://chatgpt.com/?q={prompt}',
      icon: 'chatgpt',
    },
  ],
  [
    'v0',
    {
      label: 'Open in v0',
      url: 'https://v0.dev/chat?q={prompt}',
      icon: 'v0',
    },
  ],
  [
    'claude',
    {
      label: 'Open in Claude',
      url: 'https://claude.ai/new?q={prompt}',
      icon: 'claude',
    },
  ],
  [
    'scira',
    {
      label: 'Open in Scira',
      url: 'https://scira.ai/?q={prompt}',
      icon: 'scira',
    },
  ],
])

export const StarlightThemeBlackConfigSchema = z.object({
  navLinks: NavbarItemSchema.array().optional(),

  docs: z
    .object({
      showMarkdownActions: MarkdownActionsSchema.default(true),
    })
    .default({
      showMarkdownActions: true,
    }),
})

export type StarlightThemeBlackUserConfig = z.input<
  typeof StarlightThemeBlackConfigSchema
>

export type StarlightThemeBlackConfig = z.output<
  typeof StarlightThemeBlackConfigSchema
>

type DocsConfig = StarlightThemeBlackConfig['docs']

function isOptions(
  value: MarkdownActions | undefined,
): value is Exclude<MarkdownActions, boolean> {
  return typeof value === 'object' && value !== null
}

function mergeAgents(
  global?: MarkdownActionsAgents,
  local?: MarkdownActionsAgents,
): Map<string, MarkdownActionsAgent> {
  const agents = new Map<string, MarkdownActionsAgent>()

  const addAgents = (source?: MarkdownActionsAgents) => {
    if (!source) return

    for (const key of Object.keys(source)) {
      const value = source[key]

      if (value !== undefined) {
        agents.set(key, value)
      }
    }
  }

  addAgents(global)
  addAgents(local)

  return agents
}

function normalizeMarkdownActions(
  globalConfig: MarkdownActions,
  frontmatter?: MarkdownActions,
): NormalizedMarkdownActions {
  /*
   * Frontmatter siempre gana.
   *
   * Ejemplos:
   *
   * global: false
   * frontmatter: { agents: { chatgpt: true } }
   * => habilitado
   *
   * global: { prompt: "A" }
   * frontmatter: { prompt: "B" }
   * => prompt B
   */

  if (frontmatter === false) {
    return {
      enabled: false,
      prompt: DEFAULT_PROMPT,
      agents: new Map(),
    }
  }

  if (frontmatter === undefined && globalConfig === false) {
    return {
      enabled: false,
      prompt: DEFAULT_PROMPT,
      agents: new Map(),
    }
  }

  const global =
    isOptions(globalConfig)
      ? globalConfig
      : undefined

  const local =
    isOptions(frontmatter)
      ? frontmatter
      : undefined

  return {
    enabled: true,

    prompt:
      local?.prompt ??
      global?.prompt ??
      DEFAULT_PROMPT,

    agents: mergeAgents(
      global?.agents,
      local?.agents,
    ),
  }
}

function resolveAgent(
  id: string,
  config: MarkdownActionsAgent,
  prompt: string,
): ResolvedAgent | undefined {
  if (config === false) {
    return undefined
  }

  const builtin = builtInAgents.get(id)

  const overrides =
    config === true
      ? {}
      : config

  const url =
    overrides.url ??
    builtin?.url

  if (!url) {
    return undefined
  }

  return {
    id,

    label:
      overrides.label ??
      builtin?.label ??
      id,

    url,

    prompt:
      overrides.prompt ??
      prompt,

    icon:
      overrides.icon ??
      builtin?.icon ??
      '',
  }
}

function resolveAgents(
  normalized: NormalizedMarkdownActions,
): ResolvedAgent[] {
  const agents = new Map(normalized.agents)

  /*
   * Los built-ins existen por defecto.
   * La configuración del usuario puede sobrescribirlos.
   */
  for (const id of builtInAgents.keys()) {
    if (!agents.has(id)) {
      agents.set(id, true)
    }
  }

  const resolved: ResolvedAgent[] = []

  for (const [id, config] of agents) {
    const agent = resolveAgent(
      id,
      config,
      normalized.prompt,
    )

    if (agent) {
      resolved.push(agent)
    }
  }

  return resolved
}

export function resolveMarkdownActions(
  globalConfig: DocsConfig,
  frontmatter?: MarkdownActions,
) {
  const normalized = normalizeMarkdownActions(
    globalConfig.showMarkdownActions,
    frontmatter,
  )

  if (!normalized.enabled) {
    return {
      enabled: false,
      prompt: normalized.prompt,
      agents: [],
    }
  }

  return {
    enabled: true,
    prompt: normalized.prompt,
    agents: resolveAgents(normalized),
  }
}
