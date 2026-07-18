import type { APIContext } from 'astro'
import { getEntry } from 'astro:content'
import { AstroError } from 'astro/errors'
import { getRelativeLocaleUrl } from 'astro:i18n'

import starlightConfig from 'virtual:starlight/user-config'
import userConfig from 'virtual:starlight-theme-black-config'

import type { I18nBadgeConfig } from '../schemas/badge'

const absoluteLinkRegex = /^https?:\/\//

export interface ProcessedNavbarLink {
  label: string
  link: string
  badge?: { text: string }
  attrs?: Record<string, unknown>
}

function getDefaultLang(currentLocale: APIContext['currentLocale']): string {
  const lang = currentLocale
    ? starlightConfig.locales?.[currentLocale]?.lang
    : starlightConfig.locales?.root?.lang

  return (
    lang ||
    starlightConfig.defaultLocale?.lang ||
    starlightConfig.defaultLocale?.locale ||
    'en'
  )
}

async function getInternalPageLabel(slug: string): Promise<string> {
  const page = await getEntry('docs', slug)
  return page?.data.title ?? slug
}

function getTranslation(
  currentLocale: APIContext['currentLocale'],
  fallback: string,
  translations: Record<string, string>
): string {
  if (Object.keys(translations).length === 0) return fallback

  const defaultLang = getDefaultLang(currentLocale)
  const defaultTranslation = translations[defaultLang]

  if (!defaultTranslation) {
    throw new AstroError(
      `Missing translation for default language "${defaultLang}"`,
      'Add the default locale translation.',
    )
  }

  return currentLocale
    ? translations[currentLocale] ?? defaultTranslation
    : defaultTranslation
}

function getBadgeTranslation(
  currentLocale: APIContext['currentLocale'],
  badge: NonNullable<I18nBadgeConfig>
) {
  if (typeof badge === 'string') return { text: badge }
  if (typeof badge.text === 'string') return { text: badge.text }

  return {
    text: getTranslation(currentLocale, '', badge.text),
  }
}

export async function getNavbarLinks(
  currentLocale: APIContext['currentLocale']
): Promise<ProcessedNavbarLink[]> {
  if (!userConfig.navLinks || !Array.isArray(userConfig.navLinks)) return []

  return Promise.all(
    userConfig.navLinks.map(async (item) => {
      let label = ''

      if ('label' in item && item.label) {
        label = item.label
      } else if ('slug' in item) {
        const hasTranslations = Object.keys(item.translations ?? {}).length > 0
        label = hasTranslations
          ? getTranslation(currentLocale, item.slug, item.translations ?? {})
          : await getInternalPageLabel(item.slug)
      }

      const rawLink = 'link' in item ? item.link : `/${item.slug}`

      const isAbsolute = absoluteLinkRegex.test(rawLink)
      const link = !isAbsolute && currentLocale
        ? getRelativeLocaleUrl(currentLocale, rawLink)
        : rawLink

      return {
        label,
        link,
        ...(item.badge ? { badge: getBadgeTranslation(currentLocale, item.badge) } : {}),
        ...(item.attrs ? { attrs: item.attrs } : {}),
      }
    })
  )
}
