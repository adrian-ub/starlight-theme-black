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
        updateConfig({
          components: overrideComponents(
            starlightConfig,
            [
              'ThemeSelect',
              'PageFrame',
              'Header',
              'SiteTitle',
              'Sidebar',
              'TwoColumnContent',
              'ContentPanel',
              'PageTitle',
              'MarkdownContent',
              'Hero',
              'Footer',
              'SocialIcons',
              'Pagination',
              'Search',
              'TableOfContents',
              'PageSidebar',
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
            'starlight-theme-black/styles',
          ],
          expressiveCode:
            starlightConfig.expressiveCode === false
              ? false
              : {
                  styleOverrides: {
                    codeBackground: 'hsl(var(--code-background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.75rem',
                    textMarkers: {
                      markBackground: 'hsl(var(--mark-background))',
                      markBorderColor: 'transparent',
                      backgroundOpacity: '0.4',
                      delBorderColor: 'transparent',
                      insBorderColor: 'transparent',
                    },
                    frames: {
                      editorBackground: 'hsl(var(--code-background))',
                      editorTabBarBackground: 'hsl(var(--code-background))',
                      editorTabBarBorderBottomColor: 'hsl(var(--border))',
                      editorTabBarBorderColor: 'hsl(var(--border))',
                      editorActiveTabBackground: 'hsl(var(--code-background))',
                      editorActiveTabBorderColor: 'hsl(var(--border))',
                      editorActiveTabIndicatorTopColor: 'hsl(var(--code-background))',
                      editorActiveTabIndicatorBottomColor: 'hsl(var(--code-background))',
                      tooltipSuccessBackground: 'hsl(var(--input))',
                      tooltipSuccessForeground: 'hsl(var(--input-foreground))',
                      frameBoxShadowCssValue: 'unset',
                      terminalBackground: 'hsl(var(--code-background))',
                      terminalTitlebarBackground: 'hsl(var(--code-background))',
                      terminalTitlebarBorderBottomColor: 'hsl(var(--border))',
                    },
                  },
                  themes: ['github-dark-default', 'github-light'],
                  ...(typeof starlightConfig.expressiveCode === 'object' ? starlightConfig.expressiveCode : {}),
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
      'i18n:setup': function ({ injectTranslations }) {
        injectTranslations({
          en: {
            'theme-black.home': 'Home',
            'theme-black.links.doc': 'Docs',
            'theme-black.links.api': 'API Reference',
          },
          es: {
            'theme-black.home': 'Inicio',
            'theme-black.links.doc': 'Docs',
            'theme-black.links.api': 'Referencia de la API',
          },
        })
      },
    },
  }
}
