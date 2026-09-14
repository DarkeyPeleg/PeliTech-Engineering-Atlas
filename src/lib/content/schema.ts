import { z } from 'zod';

/**
 * The frontmatter contract for every article. Validation runs when content is
 * loaded and again in `npm run validate`, so a malformed article fails the build
 * rather than rendering half-broken.
 */

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'lastUpdated must be an ISO date, e.g. 2026-09-14')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'lastUpdated is not a real date');

export const frontmatterSchema = z.object({
  /** Used as the h1, the page title and the primary search field. */
  title: z.string().min(1, 'title is required'),
  /** Used as the meta description, card summary and search field. */
  description: z.string().min(1, 'description is required'),
  /** Defaults to the top-level section label when omitted. */
  category: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).default([]),
  difficulty: z.enum(DIFFICULTIES).optional(),
  lastUpdated: isoDate.optional(),
  /** Overrides the computed estimate, in minutes. */
  readingTime: z.number().int().positive().optional(),
  /** Slugs of related articles, with or without a leading slash. */
  relatedTopics: z.array(z.string().min(1)).default([]),
  /** Hidden from navigation, search, sitemap and static generation. */
  draft: z.boolean().default(false),
  /** Sorts within a directory; lower comes first. Falls back to _meta.json order. */
  order: z.number().int().optional(),
  /** Renders the table of contents. */
  toc: z.boolean().default(true),
});

export type DocFrontmatter = z.infer<typeof frontmatterSchema>;

/**
 * `_meta.json`, the per-directory navigation metadata. Every field is optional:
 * a directory with no `_meta.json` still appears, using a title-cased folder name
 * and alphabetical ordering.
 */
export const dirMetaSchema = z.object({
  label: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  order: z.number().int().optional(),
  /** Explicit ordering; anything not listed is appended alphabetically. */
  items: z.array(z.string().min(1)).optional(),
  /** Collapse this group in the sidebar by default. */
  collapsed: z.boolean().optional(),
});

export type DirMeta = z.infer<typeof dirMetaSchema>;

export function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.join('.');
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join('; ');
}
