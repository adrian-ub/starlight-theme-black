import type { APIContext } from 'astro'
import { AstroError } from 'astro/errors'
import starlightConfig from 'virtual:starlight/user-config'
import userConfig from 'virtual:starlight-theme-black-config'
import { getRelativeLocaleUrl } from 'astro:i18n'

const defaultLang = starlightConfig.defaultLocale?.lang || starlightConfig.defaultLocale?.locale || 'en'

const absoluteLinkRegex = /^https?:\/\//

export interface ProcessedNavLink {
  label: string
  link: string
  badge?: string | undefined
  attrs?: Record<string, unknown>
}

export function getTranslation(
  currentLocale: APIContext['currentLocale'],
  translations: Record<string, string>,
  link: string,
  description: string,
): string {
  const defaultTranslation = translations[defaultLang]

  if (!defaultTranslation) {
    throw new AstroError(
      `The ${description} for "${link}" must have a key for the default language "${defaultLang}".`,
      'Update the Starlight config to include a nav link label for the default language.',
    )
  }

  let translation = defaultTranslation

  if (currentLocale) {
    translation = translations[currentLocale] ?? defaultTranslation
  }

  return translation
}

export function getNavLinks(currentLocale: APIContext['currentLocale']): ProcessedNavLink[] {
  if (!userConfig.navLinks) return []

  return userConfig.navLinks.map((nav) => {
    const link =
      !absoluteLinkRegex.test(nav.link) && currentLocale
        ? getRelativeLocaleUrl(currentLocale, nav.link)
        : nav.link

    const label =
      typeof nav.label === 'string'
        ? nav.label
        : getTranslation(currentLocale, nav.label as Record<string, string>, nav.link, 'label')

    return { label, link, badge: nav.badge, attrs: nav.attrs }
  })
}
