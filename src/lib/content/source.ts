import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
  CONTENT_DIR,
  isContentFile,
  isIgnored,
  isIndexFile,
  parseNumericPrefix,
  segmentsFromRelativePath,
  slugFromSegments,
  stripExtension,
  titleCaseFromSlug,
  hrefFromSlug,
  normalizeSlug,
} from './paths';
import { dirMetaSchema, formatZodError, frontmatterSchema, type DirMeta, type DocFrontmatter } from './schema';
import { estimateReadingTime } from './reading-time';
import { extractToc, type TocEntry } from './toc';

/**
 * The content index: one filesystem pass over `docs/`, producing every article
 * and directory. Routing, navigation, search, related links, the sitemap and all
 * page metadata are derived from this — nothing about an article is declared in
 * application code.
 */

export interface DocEntry {
  /** `system-design/scalability/load-balancing` */
  slug: string;
  segments: string[];
  href: string;
  /** Posix path relative to `docs/`, for error messages and edit links. */
  relativePath: string;
  absolutePath: string;
  frontmatter: DocFrontmatter;
  /** Frontmatter category, or the top-level section label as a fallback. */
  category: string;
  /** Raw MDX body, frontmatter removed. */
  body: string;
  toc: TocEntry[];
  readingTime: number;
  /** True when the file is the `index.mdx` of a directory. */
  isSectionIndex: boolean;
  /** First URL segment, e.g. `system-design`. */
  sectionSlug: string;
  parentSlug: string;
  /** Filename without extension or numeric prefix, matched against `_meta.items`. */
  name: string;
  numericOrder: number | null;
}

export interface DirEntry {
  /** `system-design/scalability`; empty string for the `docs/` root. */
  slug: string;
  segments: string[];
  label: string;
  description: string | undefined;
  meta: DirMeta;
  parentSlug: string;
  name: string;
  numericOrder: number | null;
  /** True when the directory has its own `index.mdx`. */
  hasIndex: boolean;
}

export interface ContentIndex {
  docs: DocEntry[];
  dirs: DirEntry[];
  bySlug: Map<string, DocEntry>;
  dirBySlug: Map<string, DirEntry>;
}

export class ContentError extends Error {
  constructor(relativePath: string, message: string) {
    super(`${relativePath}: ${message}`);
    this.name = 'ContentError';
  }
}

/** Drafts are visible locally but never published. */
const includeDrafts = process.env.NODE_ENV !== 'production';

async function readDirMeta(dirPath: string, relativePath: string): Promise<DirMeta> {
  const metaPath = path.join(dirPath, '_meta.json');
  let raw: string;
  try {
    raw = await fs.readFile(metaPath, 'utf8');
  } catch {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new ContentError(
      path.posix.join(relativePath, '_meta.json'),
      `invalid JSON (${(error as Error).message})`,
    );
  }

  const result = dirMetaSchema.safeParse(parsed);
  if (!result.success) {
    throw new ContentError(
      path.posix.join(relativePath, '_meta.json'),
      formatZodError(result.error),
    );
  }
  return result.data;
}

async function readDoc(absolutePath: string, relativePath: string): Promise<DocEntry | null> {
  const raw = await fs.readFile(absolutePath, 'utf8');
  const { data, content } = matter(raw);

  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new ContentError(relativePath, `invalid frontmatter — ${formatZodError(result.error)}`);
  }
  const frontmatter = result.data;

  if (frontmatter.draft && !includeDrafts) return null;

  const segments = segmentsFromRelativePath(relativePath);
  if (segments.length === 0) {
    throw new ContentError(relativePath, 'a root-level index file has no route; move it into a section');
  }

  const fileName = path.basename(relativePath);
  const isSectionIndex = isIndexFile(fileName);
  const { order: numericOrder, name } = parseNumericPrefix(stripExtension(fileName));
  const slug = slugFromSegments(segments);

  return {
    slug,
    segments,
    href: hrefFromSlug(slug),
    relativePath: relativePath.split(path.sep).join('/'),
    absolutePath,
    frontmatter,
    // Filled in once directory labels are known.
    category: frontmatter.category ?? '',
    body: content,
    toc: extractToc(content),
    readingTime: frontmatter.readingTime ?? estimateReadingTime(content),
    isSectionIndex,
    sectionSlug: segments[0]!,
    parentSlug: segments.slice(0, -1).join('/'),
    name: isSectionIndex ? (segments.at(-1) ?? '') : name.toLowerCase(),
    numericOrder,
  };
}

async function walk(
  dirPath: string,
  relativePath: string,
  accumulator: { docs: DocEntry[]; dirs: DirEntry[] },
): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  const fileNames = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  const hasIndex = fileNames.some((name) => isContentFile(name) && isIndexFile(name));

  if (relativePath) {
    const meta = await readDirMeta(dirPath, relativePath);
    const dirName = path.basename(relativePath);
    const { order, name } = parseNumericPrefix(dirName);
    const segments = relativePath.split(path.sep).map((part) => parseNumericPrefix(part).name.toLowerCase());

    accumulator.dirs.push({
      slug: segments.join('/'),
      segments,
      label: meta.label ?? titleCaseFromSlug(dirName),
      description: meta.description,
      meta,
      parentSlug: segments.slice(0, -1).join('/'),
      name: name.toLowerCase(),
      numericOrder: order,
      hasIndex,
    });
  }

  await Promise.all(
    entries.map(async (entry) => {
      if (isIgnored(entry.name)) return;
      const childAbsolute = path.join(dirPath, entry.name);
      const childRelative = relativePath ? path.join(relativePath, entry.name) : entry.name;

      if (entry.isDirectory()) {
        await walk(childAbsolute, childRelative, accumulator);
        return;
      }
      if (!entry.isFile() || !isContentFile(entry.name)) return;

      const doc = await readDoc(childAbsolute, childRelative);
      if (doc) accumulator.docs.push(doc);
    }),
  );
}

async function buildIndex(): Promise<ContentIndex> {
  const accumulator: { docs: DocEntry[]; dirs: DirEntry[] } = { docs: [], dirs: [] };

  try {
    await walk(CONTENT_DIR, '', accumulator);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Content directory not found at ${CONTENT_DIR}`);
    }
    throw error;
  }

  const dirBySlug = new Map(accumulator.dirs.map((dir) => [dir.slug, dir]));

  // Category falls back to the top-level section's label so cards and search
  // filters always have something to group by.
  for (const doc of accumulator.docs) {
    if (!doc.category) {
      doc.category = dirBySlug.get(doc.sectionSlug)?.label ?? titleCaseFromSlug(doc.sectionSlug);
    }
  }

  const bySlug = new Map<string, DocEntry>();
  for (const doc of accumulator.docs) {
    const existing = bySlug.get(doc.slug);
    if (existing) {
      throw new Error(
        `Duplicate route "/${doc.slug}" produced by ${existing.relativePath} and ${doc.relativePath}`,
      );
    }
    bySlug.set(doc.slug, doc);
  }

  accumulator.docs.sort((a, b) => a.slug.localeCompare(b.slug));
  accumulator.dirs.sort((a, b) => a.slug.localeCompare(b.slug));

  return { docs: accumulator.docs, dirs: accumulator.dirs, bySlug, dirBySlug };
}

let cached: Promise<ContentIndex> | null = null;

/**
 * Cached in production builds, re-read every call in development so editing an
 * article shows up without restarting the dev server.
 */
export function getContentIndex(): Promise<ContentIndex> {
  if (process.env.NODE_ENV !== 'production') return buildIndex();
  cached ??= buildIndex();
  return cached;
}

export async function getAllDocs(): Promise<DocEntry[]> {
  return (await getContentIndex()).docs;
}

export async function getDocBySlug(slug: string): Promise<DocEntry | undefined> {
  return (await getContentIndex()).bySlug.get(normalizeSlug(slug));
}

export async function getDirBySlug(slug: string): Promise<DirEntry | undefined> {
  return (await getContentIndex()).dirBySlug.get(normalizeSlug(slug));
}

/** Top-level knowledge areas, in `_meta.json` order. */
export async function getSections(): Promise<DirEntry[]> {
  const { dirs } = await getContentIndex();
  return dirs
    .filter((dir) => dir.segments.length === 1)
    .sort(compareByOrderThenLabel);
}

export function compareByOrderThenLabel(
  a: { numericOrder: number | null; meta?: DirMeta; label: string },
  b: { numericOrder: number | null; meta?: DirMeta; label: string },
): number {
  const orderA = a.meta?.order ?? a.numericOrder ?? Number.MAX_SAFE_INTEGER;
  const orderB = b.meta?.order ?? b.numericOrder ?? Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) return orderA - orderB;
  return a.label.localeCompare(b.label);
}
