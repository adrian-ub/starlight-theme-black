---
title: Markdown Actions
description: Configure the "Copy page" feature with AI services and per-page overrides.
sidebar:
  badge: New
---

The theme includes a **"Copy page"** button next to each documentation page title, with a dropdown to open the current page in various AI services. This feature is enabled by default and can be configured globally or per-page.

## Global Configuration

All markdown actions settings live under the `docs` key in the plugin config:

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
          docs: {
            showMarkdownActions: true,
          },
        }),
      ],
    }),
  ],
})
```

## Frontmatter Configuration

You can override the global config per-page using frontmatter:

```md
---
title: My Page
showMarkdownActions: false  # Disable on this page
---

---

title: My Page
showMarkdownActions:
prompt: "Explain this API at {url} with code examples."
services: ["Open in ChatGPT", "Open in Claude"]

---
```

## Frontmatter Schema

| Property              | Type                                | Description                          |
| --------------------- | ----------------------------------- | ------------------------------------ |
| `showMarkdownActions` | `boolean \| { prompt?, services? }` | Enable/disable or customize per-page |

## Options

### `showMarkdownActions` (Global)

**Type:** `boolean \| { prompt?: string, services?: Service[] }` — **Default:** `true`

- `true` — Enable with defaults
- `false` — Disable globally
- Object — Enable with custom defaults

### `showMarkdownActions` (Frontmatter)

**Type:** `boolean \| { prompt?: string, services?: string[] }` — **Default:** `true`

- `true` — Use global config
- `false` — Disable on this page
- Object — Merge with global config (frontmatter overrides)

### `prompt`

**Type:** `string`

The prompt sent to the AI service. Use the `{url}` placeholder — it will be replaced with the current page URL at render time.

**Default:**

```
I'm looking at this documentation: {url}.
Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.
```

### `services` (Global)

**Type:** `Array<{ name: string, url: string, icon: string }>`

The list of AI services shown in the dropdown. Each service has:

| Property | Description                                                                                 |
| -------- | ------------------------------------------------------------------------------------------- |
| `name`   | Label displayed in the dropdown menu.                                                       |
| `url`    | Service URL. Use `{prompt}` as a placeholder — it will be replaced with the encoded prompt. |
| `icon`   | Raw SVG string rendered next to the name.                                                   |

**Defaults:** v0, ChatGPT, Claude, and Scira — all with their official icons.

### `services` (Frontmatter)

**Type:** `string[]`

Filter global services by name. Only the listed services will appear on this page.

## Examples

### Custom prompt (global)

```js
starlightThemeBlack({
  docs: {
    showMarkdownActions: {
      prompt: 'Explain the API reference at {url} with code examples.',
    },
  },
})
```

### Custom services (global)

```js
starlightThemeBlack({
  docs: {
    showMarkdownActions: {
      services: [
        {
          name: 'Open in ChatGPT',
          url: 'https://chatgpt.com?q={prompt}',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22.282 9.821..." fill="currentColor"/></svg>',
        },
        {
          name: 'Ask Perplexity',
          url: 'https://perplexity.ai/search?q={prompt}',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>',
        },
      ],
    },
  },
})
```

### Filter services per-page (frontmatter)

Only show ChatGPT and Claude on a specific page:

```md
---
title: My API Reference
showMarkdownActions:
  services: ["Open in ChatGPT", "Open in Claude"]
---
```

### Custom prompt per-page (frontmatter)

```md
---
title: My API Reference
showMarkdownActions:
  prompt: "Explain this API at {url} with code examples."
---
```

### Disable on specific pages (frontmatter)

```md
---
title: Internal Notes
showMarkdownActions: false
---
```

### Disable globally

```js
starlightThemeBlack({
  docs: {
    showMarkdownActions: false,
  },
})
```

## Overriding the component

For full control, override the `PageTitle` component via Starlight's component override system. This gives you direct access to `Astro.url`, `Astro.locals`, and the full Astro API:

```js
starlight({
  components: {
    PageTitle: './src/components/MyPageTitle.astro',
  },
})
```

Refer to the [Starlight overrides guide](https://starlight.astro.build/guides/overriding-components/) for details.
