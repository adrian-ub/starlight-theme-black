import type { AstroBuiltinAttributes } from 'astro'
import type { HTMLAttributes } from 'astro/types'
import { z } from 'astro/zod'

const linkHTMLAttributesSchema = z.record(
  z.union([z.string(), z.number(), z.boolean(), z.undefined()]),
) as z.Schema<Omit<HTMLAttributes<'a'>, keyof AstroBuiltinAttributes | 'children'>>

// eslint-disable-next-line ts/explicit-function-return-type
const LinkItemHTMLAttributesSchema = () => linkHTMLAttributesSchema.default({})

const navLinkSchema = z.object({
  badge: z.string().optional(),
  label: z.union([z.string(), z.record(z.string())]),
  link: z.string(),
  attrs: LinkItemHTMLAttributesSchema(),
})

export const StarlightThemeBlackConfigSchema = z.object({
  navLinks: z.array(navLinkSchema).optional(),
  docs: z
    .object({
      includeAiUtilities: z.boolean().default(true),
    })
    .optional()
    .default({}),
  footerText: z.string().optional().default('Built & designed by [shadcn](https://twitter.com/shadcn). Ported to Astro Starlight by [Adrián UB](https://github.com/adrian-ub). The source code is available on [GitHub](https://github.com/adrian-ub/starlight-theme-black).'),
})

export type StarlightThemeBlackUserConfig = z.input<typeof StarlightThemeBlackConfigSchema>
export type StarlightThemeBlackConfig = z.output<typeof StarlightThemeBlackConfigSchema>
