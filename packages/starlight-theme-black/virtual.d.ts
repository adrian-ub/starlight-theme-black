declare module 'virtual:starlight-theme-black-config' {
  const StarlightThemeBlackConfig: import('./libs/config').StarlightThemeBlackConfig

  export default StarlightThemeBlackConfig
}

declare module 'virtual:starlight/user-config' {
  const Config: import('@astrojs/starlight/types').StarlightConfig
  export default Config
}

declare module 'virtual:starlight/user-images' {
  type ImageMetadata = import('astro').ImageMetadata
  export const logos: {
    dark?: ImageMetadata
    light?: ImageMetadata
  }
}

declare module 'virtual:starlight/pagefind-config' {
  export const pagefindUserConfig: Partial<
    Extract<import('@astrojs/starlight/types').StarlightConfig['pagefind'], object>
  >
}

declare module 'virtual:starlight/project-context' {
  const ProjectContext: {
    root: string;
    srcDir: string;
    trailingSlash: import('astro').AstroConfig['trailingSlash'];
    build: {
      format: import('astro').AstroConfig['build']['format'];
    };
    legacyCollections: boolean;
  };
  export default ProjectContext;
}
