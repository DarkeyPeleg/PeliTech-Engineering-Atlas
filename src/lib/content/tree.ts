import { getContentIndex, type ContentIndex, type DirEntry, type DocEntry } from './source';
import { hrefFromSlug, normalizeSlug } from './paths';
import type { Difficulty } from './schema';

/**
 * The navigation tree, derived entirely from the content index. The sidebar,
 * breadcrumbs, previous/next links, section landing pages and the homepage all
 * consume this, so ordering and labels are defined in exactly one place.
 *
 * Ordering within a directory:
 *   1. `_meta.json` `items` (explicit list, by file/folder name)
 *   2. frontmatter `order` / `_meta.json` `order`
 *   3. `01-` numeric filename prefix
 *   4. alphabetical by title
 */

export interface DocNode {
  type: 'doc';
  slug: string;
  href: string;
  label: string;
  description: string;
  difficulty: Difficulty | undefined;
}

export interface SectionNode {
  type: 'section';
  slug: string;
  href: string | null;
  label: string;
  description: string | undefined;
  collapsed: boolean;
  children: NavNode[];
}

export type NavNode = DocNode | SectionNode;

function docLabel(doc: DocEntry): string {
  return doc.frontmatter.title;
}

function toDocNode(doc: DocEntry): DocNode {
  return {
    type: 'doc',
    slug: doc.slug,
    href: doc.href,
    label: docLabel(doc),
    description: doc.frontmatter.description,
    difficulty: doc.frontmatter.difficulty,
  };
}

interface Sortable {
  name: string;
  explicitOrder: number | null;
  numericOrder: number | null;
  label: string;
}

function sortChildren<T extends Sortable>(children: T[], items: string[] | undefined): T[] {
  const explicitIndex = new Map((items ?? []).map((name, index) => [normalizeSlug(name), index]));

  return [...children].sort((a, b) => {
    const listedA = explicitIndex.get(a.name);
    const listedB = explicitIndex.get(b.name);

    if (listedA !== undefined && listedB !== undefined) return listedA - listedB;
    // Anything named in `items` comes before anything that is not.
    if (listedA !== undefined) return -1;
    if (listedB !== undefined) return 1;

    const orderA = a.explicitOrder ?? a.numericOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.explicitOrder ?? b.numericOrder ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;

    return a.label.localeCompare(b.label);
  });
}

function buildChildren(index: ContentIndex, parentSlug: string): NavNode[] {
  type Candidate = Sortable & { node: NavNode };

  const candidates: Candidate[] = [];

  for (const dir of index.dirs) {
    if (dir.parentSlug !== parentSlug || dir.slug === parentSlug) continue;
    candidates.push({
      name: dir.name,
      explicitOrder: dir.meta.order ?? null,
      numericOrder: dir.numericOrder,
      label: dir.label,
      node: buildSectionNode(index, dir),
    });
  }

  for (const doc of index.docs) {
    // A section index is represented by its directory node, not as a sibling.
    if (doc.parentSlug !== parentSlug || doc.isSectionIndex) continue;
    candidates.push({
      name: doc.name,
      explicitOrder: doc.frontmatter.order ?? null,
      numericOrder: doc.numericOrder,
      label: docLabel(doc),
      node: toDocNode(doc),
    });
  }

  const parentMeta = parentSlug ? index.dirBySlug.get(parentSlug)?.meta : undefined;
  return sortChildren(candidates, parentMeta?.items).map((candidate) => candidate.node);
}

function buildSectionNode(index: ContentIndex, dir: DirEntry): SectionNode {
  const indexDoc = index.bySlug.get(dir.slug);
  const children = buildChildren(index, dir.slug);

  return {
    type: 'section',
    slug: dir.slug,
    // Directories are always routable: they render their index.mdx, or an
    // auto-generated listing when there is none.
    href: hrefFromSlug(dir.slug),
    label: indexDoc?.frontmatter.title ?? dir.label,
    description: dir.description ?? indexDoc?.frontmatter.description,
    collapsed: dir.meta.collapsed ?? false,
    children,
  };
}

export async function getNavTree(): Promise<SectionNode[]> {
  const index = await getContentIndex();
  return index.dirs
    .filter((dir) => dir.segments.length === 1)
    .map((dir) => buildSectionNode(index, dir))
    .sort((a, b) => {
      const metaA = index.dirBySlug.get(a.slug);
      const metaB = index.dirBySlug.get(b.slug);
      const orderA = metaA?.meta.order ?? metaA?.numericOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = metaB?.meta.order ?? metaB?.numericOrder ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return a.label.localeCompare(b.label);
    });
}

/** Immediate children of a directory, for auto-generated section listings. */
export async function getSectionChildren(slug: string): Promise<NavNode[]> {
  const index = await getContentIndex();
  return buildChildren(index, normalizeSlug(slug));
}

export interface Breadcrumb {
  label: string;
  href: string;
}

export async function getBreadcrumbs(slug: string): Promise<Breadcrumb[]> {
  const index = await getContentIndex();
  const segments = normalizeSlug(slug).split('/').filter(Boolean);
  const crumbs: Breadcrumb[] = [];

  for (let depth = 1; depth <= segments.length; depth += 1) {
    const partial = segments.slice(0, depth).join('/');
    const dir = index.dirBySlug.get(partial);
    const doc = index.bySlug.get(partial);
    const label = doc?.frontmatter.title ?? dir?.label;
    if (!label) continue;
    crumbs.push({ label, href: hrefFromSlug(partial) });
  }

  return crumbs;
}

/**
 * Depth-first flattening of the tree — the reading order used for
 * previous/next links.
 */
export async function getFlatReadingOrder(): Promise<DocNode[]> {
  const tree = await getNavTree();
  const flat: DocNode[] = [];

  const walk = (nodes: NavNode[]): void => {
    for (const node of nodes) {
      if (node.type === 'doc') {
        flat.push(node);
        continue;
      }
      flat.push({
        type: 'doc',
        slug: node.slug,
        href: node.href ?? hrefFromSlug(node.slug),
        label: node.label,
        description: node.description ?? '',
        difficulty: undefined,
      });
      walk(node.children);
    }
  };

  walk(tree);
  return flat;
}

export interface Siblings {
  previous: DocNode | null;
  next: DocNode | null;
}

export async function getSiblings(slug: string): Promise<Siblings> {
  const flat = await getFlatReadingOrder();
  const target = normalizeSlug(slug);
  const position = flat.findIndex((node) => node.slug === target);
  if (position === -1) return { previous: null, next: null };
  return {
    previous: flat[position - 1] ?? null,
    next: flat[position + 1] ?? null,
  };
}
