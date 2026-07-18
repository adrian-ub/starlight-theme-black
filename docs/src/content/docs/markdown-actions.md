---
title: Markdown Actions
description: Configure the "Copy page" feature with AI agents and per-page overrides.
sidebar:
  badge: New
---

The theme includes a **"Copy page"** button next to each documentation page title, with a dropdown to open the current page in various AI agents. This feature is enabled by default and can be configured globally or per-page.

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
            showMarkdownActions: {
              prompt: 'I\'m looking at this documentation: {url}. Help me understand it.',
              agents: {
                chatgpt: true,
                claude: true,
                v0: true,
                scira: true,
              },
            },
          },
        }),
      ],
    }),
  ],
})
```

## Built-in Agents

The theme includes 4 agents by default:

| ID        | Label           | URL                                |
| --------- | --------------- | ---------------------------------- |
| `chatgpt` | Open in ChatGPT | `https://chatgpt.com?q={prompt}`   |
| `v0`      | Open in v0      | `https://v0.dev?q={prompt}`        |
| `claude`  | Open in Claude  | `https://claude.ai/new?q={prompt}` |
| `scira`   | Open in Scira   | `https://scira.ai/?q={prompt}`     |

## Adding Custom Agents

Add new agents with a unique key:

```js
starlightThemeBlack({
  docs: {
    showMarkdownActions: {
      agents: {
        // Use built-in defaults
        chatgpt: true,

        // Add custom agent
        perplexity: {
          label: 'Ask Perplexity',
          url: 'https://perplexity.ai/search?q={prompt}',
          prompt: 'Explain this documentation: {url}',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>',
        },
      },
    },
  },
})
```

## Agent Options

Each agent object supports:

| Property | Type     | Description                                                                  |
| -------- | -------- | ---------------------------------------------------------------------------- |
| `label`  | `string` | Display name in the dropdown.                                                |
| `url`    | `string` | Service URL. Use `{prompt}` as placeholder for the encoded prompt.           |
| `prompt` | `string` | Prompt template. Use `{url}` as placeholder for the page URL.                |
| `icon`   | `string` | SVG string rendered next to the label. Built-in agents have their own icons. |

## Frontmatter Configuration

Override the global config per-page using frontmatter:

```md
---
title: My Page
showMarkdownActions: false  # Disable on this page
---

---

title: My Page
showMarkdownActions:
agents:
chatgpt: true # Keep enabled
claude: false # Disable on this page
v0:
prompt: 'Custom prompt for this page at {url}' # Override prompt

---
```

## Frontmatter Schema

| Property              | Type                              | Description                          |
| --------------------- | --------------------------------- | ------------------------------------ |
| `showMarkdownActions` | `boolean \| { prompt?, agents? }` | Enable/disable or customize per-page |

## Merging Logic

1. Built-in agents (chatgpt, v0, claude, scira) are loaded as defaults
2. Global config agents override/add to defaults
3. Frontmatter agents override the merged result:
   - `false` → remove agent
   - `true` → keep as-is
   - `{ ... }` → merge (frontmatter wins)

**Prompt resolution** (per agent):

1. Frontmatter agent-specific `prompt`
2. Global agent-specific `prompt`
3. Frontmatter root `prompt`
4. Global root `prompt`
5. Hardcoded default

## Examples

### Disable all agents except ChatGPT

```js
starlightThemeBlack({
  docs: {
    showMarkdownActions: {
      agents: {
        chatgpt: true,
        v0: false,
        claude: false,
        scira: false,
      },
    },
  },
})
```

### Custom prompt for all agents

```js
starlightThemeBlack({
  docs: {
    showMarkdownActions: {
      prompt: 'Explain the API reference at {url} with code examples.',
    },
  },
})
```

### Disable globally

```js
starlightThemeBlack({
  docs: {
    showMarkdownActions: false,
  },
})
```

### Disable on specific page

```md
---
title: Internal Notes
showMarkdownActions: false
---
```

## Overriding the component

For full control, override the `PageTitle` component via Starlight's component override system:

```js
starlight({
  components: {
    PageTitle: './src/components/MyPageTitle.astro',
  },
})
```

Refer to the [Starlight overrides guide](https://starlight.astro.build/guides/overriding-components/) for details.
