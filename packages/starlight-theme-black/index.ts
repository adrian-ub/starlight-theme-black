import type { StarlightPlugin } from '@astrojs/starlight/types'

import { StarlightThemeBlackConfigSchema, type StarlightThemeBlackUserConfig } from './libs/config'
import { overrideComponents } from './libs/starlight'
import { vitePluginStarlightThemeBlack } from './libs/vite'

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
            '@fontsource/geist-mono/100.css',
            '@fontsource/geist-mono/200.css',
            '@fontsource/geist-mono/300.css',
            '@fontsource/geist-mono/400.css',
            '@fontsource/geist-mono/500.css',
            '@fontsource/geist-mono/600.css',
            '@fontsource/geist-mono/700.css',
            '@fontsource/geist-mono/800.css',
            '@fontsource/geist-mono/900.css',
            '@fontsource/geist-sans/100.css',
            '@fontsource/geist-sans/200.css',
            '@fontsource/geist-sans/300.css',
            '@fontsource/geist-sans/400.css',
            '@fontsource/geist-sans/500.css',
            '@fontsource/geist-sans/600.css',
            '@fontsource/geist-sans/700.css',
            '@fontsource/geist-sans/800.css',
            '@fontsource/geist-sans/900.css',
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
              updateConfig({ vite: { plugins: [vitePluginStarlightThemeBlack(config)] } })
            },
          },
        })
      },
    },
  }
}
