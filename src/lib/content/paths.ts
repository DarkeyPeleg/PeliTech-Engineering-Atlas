import path from 'node:path';

/**
 * Filesystem-to-URL mapping. The rules here are the whole routing contract:
 *
 *   docs/system-design/scalability/load-balancing.mdx
 *     -> /system-design/scalability/load-balancing
 *
 *   docs/databases/index.mdx
 *     -> /databases
 *
 *   docs/case-studies/payment-system/02-capacity.mdx
 *     -> /case-studies/payment-system/capacity      (numeric prefix sorts, then is dropped)
 */

export const CONTENT_DIR = path.join(process.cwd(), 'docs');
export const CONTENT_EXTENSIONS = ['.mdx', '.md'] as const;

/** Directories and files the content walker skips entirely. */
export const IGNORED_ENTRIES = ['_templates', 'node_modules', '.git'] as const;

const NUMERIC_PREFIX = /^(\d+)[-_]/;
const INDEX_NAMES = ['index', 'readme'] as const;

export function isContentFile(fileName: string): boolean {
  return CONTENT_EXTENSIONS.some((extension) => fileName.endsWith(extension));
}

export function isIgnored(entryName: string): boolean {
  // `_`-prefixed entries are content-system metadata (_meta.json, _templates/).
  return entryName.startsWith('_') || entryName.startsWith('.');
}

/** Strips a `01-` style ordering prefix, returning the weight and the clean name. */
export function parseNumericPrefix(name: string): { order: number | null; name: string } {
  const match = NUMERIC_PREFIX.exec(name);
  if (!match?.[1]) return { order: null, name };
  return { order: Number.parseInt(match[1], 10), name: name.slice(match[0].length) };
}

export function stripExtension(fileName: string): string {
  for (const extension of CONTENT_EXTENSIONS) {
    if (fileName.endsWith(extension)) return fileName.slice(0, -extension.length);
  }
  return fileName;
}

export function isIndexFile(fileName: string): boolean {
  const base = parseNumericPrefix(stripExtension(fileName)).name.toLowerCase();
  return INDEX_NAMES.includes(base as (typeof INDEX_NAMES)[number]);
}

/**
 * Converts a path relative to `docs/` into URL segments.
 * Returns an empty array for a root `index.mdx`, which has no route of its own.
 */
export function segmentsFromRelativePath(relativePath: string): string[] {
  const parts = relativePath.split(path.sep).filter(Boolean);
  const fileName = parts.pop();
  if (!fileName) return [];

  const dirSegments = parts.map((part) => parseNumericPrefix(part).name.toLowerCase());

  if (isIndexFile(fileName)) return dirSegments;

  const base = parseNumericPrefix(stripExtension(fileName)).name.toLowerCase();
  return [...dirSegments, base];
}

export function slugFromSegments(segments: string[]): string {
  return segments.join('/');
}

/** Normalizes author-written references (`/a/b`, `a/b`, `a/b/`) to a bare slug. */
export function normalizeSlug(reference: string): string {
  return reference.trim().replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase();
}

export function hrefFromSlug(slug: string): string {
  return `/${slug}`;
}

/** Fallback label for a directory with no `_meta.json`: `api-design` -> `Api Design`. */
export function titleCaseFromSlug(segment: string): string {
  return parseNumericPrefix(segment)
    .name.split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
