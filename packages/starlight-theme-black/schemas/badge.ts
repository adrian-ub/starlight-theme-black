import { z } from 'astro/zod'

const badgeSchema = z.object({
  text: z.string(),
})

const i18nBadgeSchema = z.object({
  text: z.union([
    z.string(),
    z.record(z.string(), z.string()),
  ]),
})

export const BadgeConfigSchema = () =>
  z
    .union([
      z.string(),
      badgeSchema,
    ])
    .transform((badge) => {
      if (typeof badge === 'string') {
        return {
          text: badge,
        }
      }

      return badge
    })
    .optional()

export const I18nBadgeConfigSchema = () =>
  z
    .union([
      z.string(),
      i18nBadgeSchema,
    ])
    .optional()

export type Badge = z.output<typeof badgeSchema>

export type I18nBadge = z.output<typeof i18nBadgeSchema>

export type I18nBadgeConfig = z.output<
  ReturnType<typeof I18nBadgeConfigSchema>
>
