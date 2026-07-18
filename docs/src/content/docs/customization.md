---
title: Customization
---

## Custom CSS

To customize the styles applied to your Starlight site when using `starlight-theme-black`, you can provide additional CSS files to modify or extend Starlight and `starlight-theme-black` default styles.

[Learn more about custom CSS in the Starlight documentation.](https://starlight.astro.build/guides/css-and-tailwind/#custom-css-styles)

## Cascade layers

Like Starlight, `starlight-theme-black` uses [cascade layers](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_layers) internally to manage the order of its styles.
This ensures a predictable CSS order and allows for simpler overrides.
Any custom unlayered CSS will override the default styles from Starlight and `starlight-theme-black`.

If you are using cascade layers, you can use [`@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) in your [custom CSS](https://starlight.astro.build/guides/css-and-tailwind/#custom-css-styles) to define the order of precedence for different layers relative to styles from the `starlight` and `black` layers:

```css "starlight" "black"
/* src/styles/custom.css */
@layer my-reset, starlight, black, my-overrides;
```

The example above defines a custom layer named `my-reset`, applied before all Starlight and `starlight-theme-black` layers, and another named `my-overrides`, applied after all Starlight and `starlight-theme-black` layers.
Any styles in the `my-overrides` layer would take precedence over Starlight and `starlight-theme-black` styles, but Starlight or `starlight-theme-black` could still change styles set in the `my-reset` layer.

## Navbar Links

The `navLinks` option adds navigation links to the header navbar. Links are rendered on desktop and inside the mobile navigation overlay.

### Basic usage

```js
// astro.config.mjs
starlightThemeBlack({
  navLinks: [
    { label: 'Home', link: '/' },
    { label: 'Docs', link: '/getting-started' },
  ],
})
```

### External links

For external URLs, pass the full URL and optionally add `target` and `rel` attributes:

```js
navLinks: [
  { label: 'Home', link: '/' },
  {
    label: 'Starlight',
    link: 'https://starlight.astro.build',
    attrs: { target: '_blank', rel: 'noopener' },
  },
]
```

### Internal slugs

Use a string shorthand to link to a Content Collection entry by slug. The label is inferred from the page's `title` frontmatter:

```js
navLinks: [
  { label: 'Home', link: '/' },
  'getting-started', // resolves to /getting-started with title from frontmatter
]
```

To override the inferred label, use the object form with `slug`:

```js
navLinks: [
  {
    slug: 'getting-started',
    label: 'Get Started',
  },
]
```

### Badges

Add a badge next to any link label. Badges support plain strings or i18n objects:

```js
navLinks: [
  // Plain string badge
  {
    label: 'Docs',
    link: '/docs',
    badge: 'New',
  },

  // i18n badge (per-locale text)
  {
    label: 'Docs',
    link: '/docs',
    badge: { text: { en: 'New', es: 'Nuevo' } },
  },
]
```

### Label translations

Translate the link label for multilingual sites:

```js
navLinks: [
  {
    label: { en: 'Blog', es: 'Blog', fr: 'Blog' },
    link: '/blog',
  },
]
```

### Full example

```js
// astro.config.mjs
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightThemeBlack from 'starlight-theme-black'

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightThemeBlack({
          navLinks: [
            { label: 'Home', link: '/' },
            'getting-started',
            {
              label: 'Docs',
              link: '/docs',
              badge: { text: { en: 'New', es: 'Nuevo' } },
            },
            {
              label: 'Starlight',
              link: 'https://starlight.astro.build',
              attrs: { target: '_blank', rel: 'noopener' },
            },
          ],
        }),
      ],
    }),
  ],
})
```
