import type { AstroBuiltinAttributes } from 'astro';
import type { HTMLAttributes } from 'astro/types';
import { z } from 'astro/zod'
import { I18nBadgeConfigSchema } from './badge';

const NavbarBaseSchema = z.object({
  /** The visible label for this item in the sidebar. */
  label: z.string(),
  /** Translations of the `label` for each supported language. */
  translations: z.record(z.string(), z.string()).default({}),
  /** Adds a badge to the item */
  badge: I18nBadgeConfigSchema()
});

const linkHTMLAttributesSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.undefined(), z.null()])
) as z.ZodType<LinkHTMLAttributes, LinkHTMLAttributes>;
export type LinkHTMLAttributes = Omit<
  HTMLAttributes<'a'>,
  keyof AstroBuiltinAttributes | 'children'
>;

export const NavbarLinkItemHTMLAttributesSchema = () => linkHTMLAttributesSchema.default({});

const NavbarLinkItemSchema = z.strictObject({
  ...NavbarBaseSchema.shape,
  /** The link to this item’s content. Can be a relative link to local files or the full URL of an external page. */
  link: z.string(),
  /** HTML attributes to add to the link item. */
  attrs: NavbarLinkItemHTMLAttributesSchema(),
});

const InternalNavbarLinkItemSchema = z.object({
  ...NavbarBaseSchema.partial({ label: true }).shape,
  /** The link to this item’s content. Must be a slug of a Content Collection entry. */
  slug: z.string(),
  /** HTML attributes to add to the link item. */
  attrs: NavbarLinkItemHTMLAttributesSchema(),
});

const InternalNavbarLinkItemShorthandSchema = z
  .string()
  .transform((slug) => InternalNavbarLinkItemSchema.parse({ slug }));


export const NavbarItemSchema = z.union([
  NavbarLinkItemSchema,
  InternalNavbarLinkItemSchema,
  InternalNavbarLinkItemShorthandSchema
])
export type NavbarItem = z.infer<typeof NavbarItemSchema>;
