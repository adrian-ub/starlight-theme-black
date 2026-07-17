import type { StarlightPlugin } from '@astrojs/starlight/types'

import { StarlightThemeBlackConfigSchema, type StarlightThemeBlackUserConfig } from './libs/config'
import { overrideComponents } from './libs/starlight'
import { vitePluginStarlightThemeBlack } from './libs/vite'
import { fontProviders } from 'astro/config'

export default function starlightThemeBlack(userConfig: StarlightThemeBlackUserConfig): StarlightPlugin {
  const parsedConfig = StarlightThemeBlackConfigSchema.safeParse(userConfig)

  if (!parsedConfig.success) {
    throw new Error(`The provided plugin configuration is invalid.\n${parsedConfig.error.issues.map(issue => issue.message).join('\n')}`)
  }

  const config = parsedConfig.data

  return {
    name: 'starlight-theme-black-plugin',
    hooks: {
      'config:setup': function ({ config: starlightConfig, logger, updateConfig, addIntegration }) {
        const userExpressiveCodeConfig
          = starlightConfig.expressiveCode === false || starlightConfig.expressiveCode === true ? {} : starlightConfig.expressiveCode

        updateConfig({
          components: overrideComponents(
            starlightConfig,
            [
              'Head',
              'Hero',
              'MobileMenuToggle',
              'PageTitle',
              'Pagination',
              'Sidebar',
              'SiteTitle',
              'ThemeSelect',
            ],
            logger,
          ),
          customCss: [
            ...(starlightConfig.customCss ?? []),
            'starlight-theme-black/styles/layers',
            'starlight-theme-black/styles/theme',
            'starlight-theme-black/styles/base',
          ],
          expressiveCode:
            starlightConfig.expressiveCode === false
              ? false
              : {
                themes: ['vesper', 'github-light-default'],
                ...userExpressiveCodeConfig,
                styleOverrides: {
                  codeBackground: 'var(--code-background)',
                  borderRadius: 'calc(var(--radius) + 4px)',
                  gutterBorderWidth: '0px',
                  borderColor: 'transparent',
                  gutterBorderColor: 'transparent',
                  ...userExpressiveCodeConfig?.styleOverrides,
                  frames: {
                    shadowColor: 'transparent',
                    editorBackground: 'var(--code-background)',
                    terminalBackground: 'var(--code-background)',
                    editorTabBarBackground: 'var(--code-background)',
                    editorActiveTabBackground: 'var(--code-background)',
                    editorActiveTabIndicatorTopColor: 'transparent',
                    editorTabBarBorderColor: 'transparent',
                    editorActiveTabBorderColor: 'transparent',
                    terminalTitlebarBorderBottomColor: 'transparent',
                    editorTabBarBorderBottomColor: 'var(--border)',
                    editorActiveTabIndicatorBottomColor: 'var(--border)',
                    ...userExpressiveCodeConfig?.styleOverrides?.frames,
                  },
                  textMarkers: {
                    markBackground: 'var(--mark-background)',
                    markBorderColor: 'var(--border)',
                    ...userExpressiveCodeConfig?.styleOverrides?.textMarkers,
                  },
                },
              },
        })

        addIntegration({
          name: 'starlight-theme-black-integration',
          hooks: {
            'astro:config:setup': ({ updateConfig }) => {
              updateConfig({
                vite: {
                  plugins: [vitePluginStarlightThemeBlack(config)]
                },
                fonts: [
                  {
                    provider: fontProviders.fontsource(),
                    name: 'Geist Variable',
                    cssVariable: "--font-geist",
                  },
                  {
                    provider: fontProviders.fontsource(),
                    name: 'Geist Mono Variable',
                    cssVariable: "--font-geist-mono",
                  }
                ]
              })
            },
          },
        })
      },
    },
  }
}
