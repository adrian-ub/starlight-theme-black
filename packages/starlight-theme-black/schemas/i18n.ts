import { z } from 'astro/zod'

function blackI18nSchema(): z.ZodObject<{
  'black.home': z.ZodOptional<z.ZodString>
  'black.links.doc': z.ZodOptional<z.ZodString>
  'black.links.api': z.ZodOptional<z.ZodString>
}> {
  return z
    .object({
      'black.home': z
        .string()
        .describe('Text display in drawer'),
      'black.links.doc': z
        .string()
        .describe('Text display in links doc'),
      'black.links.api': z
        .string()
        .describe('Text display in links api'),

    })
    .partial()
}

// eslint-disable-next-line ts/explicit-function-return-type
export function builtinI18nSchema() {
  return blackI18nSchema()
    .required()
    .strict()
}
