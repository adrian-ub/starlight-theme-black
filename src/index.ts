import type { StarlightPlugin } from '@astrojs/starlight/types'

import { StarlightThemeBlackConfigSchema, type StarlightThemeBlackUserConfig } from './libs/config'
import { overrideComponents } from './libs/starlight'
import { vitePluginStarlightThemeBlack } from './libs/vite'
import translations from './translations'

const fontStyles = [
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
]

export default function starlightThemeBlack({ footerText, navLinks }: StarlightThemeBlackUserConfig): StarlightPlugin {
  const parsedConfig = StarlightThemeBlackConfigSchema.safeParse({
    footerText,
    navLinks,
  })

  if (!parsedConfig.success) {
    throw new Error(`The provided plugin configuration is invalid.\n${parsedConfig.error.issues.map(issue => issue.message).join('\n')}`)
  }

  const blackConfig = parsedConfig.data

  return {
    name: 'starlight-theme-black-plugin',
    hooks: {
      'config:setup': function ({ config, logger, updateConfig, addIntegration }) {
        const userExpressiveCodeConfig
          = config.expressiveCode === false || config.expressiveCode === true ? {} : config.expressiveCode

        updateConfig({
          components: overrideComponents(
            config,
            ['ThemeSelect'],
            logger,
          ),
          customCss: [
            ...(config.customCss ?? []),
            ...fontStyles,
            'starlight-theme-black/styles/layers',
            'starlight-theme-black/styles/theme',
            'starlight-theme-black/styles/base',
          ],
          expressiveCode:
            config.expressiveCode === false
              ? false
              : {
                  themes: ['github-dark-default', 'github-light-default'],
                  ...userExpressiveCodeConfig,
                  // styleOverrides: {
                  // // codeBackground: 'var(--code-background)',
                  //   borderWidth: '0px',
                  //   borderRadius: 'calc(var(--radius) + 4px)',
                  //   gutterBorderWidth: '0px',
                  //   ...userExpressiveCodeConfig?.styleOverrides,
                  //   frames: {
                  //   // editorBackground: 'var(--code-background)',
                  //   // terminalBackground: 'var(--code-background)',
                  //     copyIcon: createInlineSvgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>`),
                  //     ...userExpressiveCodeConfig?.styleOverrides?.frames,
                  //   },
                  //   textMarkers: {
                  //   // markBackground: 'var(--mark-background)',
                  //   // markBorderColor: 'var(--border)',
                  //     ...userExpressiveCodeConfig?.styleOverrides?.textMarkers,
                  //   },
                  // },
                },
        })

        addIntegration({
          name: 'starlight-theme-black-integration',
          hooks: {
            'astro:config:setup': ({ updateConfig }) => {
              updateConfig({ vite: { plugins: [vitePluginStarlightThemeBlack(blackConfig)] } })
            },
          },
        })
      },
      'i18n:setup': function ({ injectTranslations }) {
        injectTranslations(translations)
      },
    },
  }
}
