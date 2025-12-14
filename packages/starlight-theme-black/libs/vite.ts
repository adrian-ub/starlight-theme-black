import type { ViteUserConfig } from 'astro'
import type { StarlightThemeBlackConfig } from './config'

export function vitePluginStarlightThemeBlack(config: StarlightThemeBlackConfig): VitePlugin {
  const moduleId = 'virtual:starlight-theme-black-config'
  const resolvedModuleId = `\0${moduleId}`
  const moduleContent = `export default ${JSON.stringify(config)}`

  return {
    name: 'vite-plugin-starlight-theme-black',
    load(id) {
      return id === resolvedModuleId ? moduleContent : undefined
    },
    resolveId(id) {
      return id === moduleId ? resolvedModuleId : undefined
    },
  }
}

type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number]
