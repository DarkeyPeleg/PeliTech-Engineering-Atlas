import { getContentIndex, type ContentIndex, type DocEntry } from './source';
import { normalizeSlug } from './paths';
import type { Difficulty } from './schema';

/**
 * Related-content resolution.
 *
 * Authors may reference a related article by full slug
 * (`system-design/scalability/load-balancing`) or by its final segment
 * (`load-balancing`) when that is unambiguous. Anything unresolvable or
 * ambiguous is reported by `npm run validate`, so a rename cannot silently
 * leave dangling links.
 */

export interface RelatedLink {
  slug: string;
  href: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty | undefined;
}

export type ResolutionFailure =
  | { reference: string; reason: 'not-found' }
  | { reference: string; reason: 'ambiguous'; candidates: string[] };

export interface RelatedResult {
  /** Explicit `relatedTopics`, in the order the author listed them. */
  links: RelatedLink[];
  /** Tag-overlap suggestions, used only when there are no explicit links. */
  suggested: RelatedLink[];
  failures: ResolutionFailure[];
}

function toLink(doc: DocEntry): RelatedLink {
  return {
    slug: doc.slug,
    href: doc.href,
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    category: doc.category,
    difficulty: doc.frontmatter.difficulty,
  };
}

/** Builds the suffix lookup used for short references. */
function indexByFinalSegment(index: ContentIndex): Map<string, DocEntry[]> {
  const bySegment = new Map<string, DocEntry[]>();
  for (const doc of index.docs) {
    const last = doc.segments.at(-1);
    if (!last) continue;
    const bucket = bySegment.get(last);
    if (bucket) bucket.push(doc);
    else bySegment.set(last, [doc]);
  }
  return bySegment;
}

export function resolveReference(
  index: ContentIndex,
  bySegment: Map<string, DocEntry[]>,
  reference: string,
): DocEntry | ResolutionFailure {
  const normalized = normalizeSlug(reference);

  const exact = index.bySlug.get(normalized);
  if (exact) return exact;

  const candidates = bySegment.get(normalized) ?? [];
  if (candidates.length === 1) return candidates[0]!;
  if (candidates.length > 1) {
    return {
      reference,
      reason: 'ambiguous',
      candidates: candidates.map((doc) => doc.slug),
    };
  }

  return { reference, reason: 'not-found' };
}

const MAX_SUGGESTIONS = 4;

function suggestByTags(index: ContentIndex, doc: DocEntry, exclude: Set<string>): RelatedLink[] {
  const tags = new Set(doc.frontmatter.tags.map((tag) => tag.toLowerCase()));
  if (tags.size === 0) return [];

  const scored: { doc: DocEntry; overlap: number }[] = [];

  for (const candidate of index.docs) {
    if (candidate.slug === doc.slug || exclude.has(candidate.slug)) continue;
    const overlap = candidate.frontmatter.tags.reduce(
      (total, tag) => (tags.has(tag.toLowerCase()) ? total + 1 : total),
      0,
    );
    if (overlap > 0) scored.push({ doc: candidate, overlap });
  }

  return scored
    .sort(
      (a, b) =>
        b.overlap - a.overlap || a.doc.frontmatter.title.localeCompare(b.doc.frontmatter.title),
    )
    .slice(0, MAX_SUGGESTIONS)
    .map((entry) => toLink(entry.doc));
}

export async function getRelated(doc: DocEntry): Promise<RelatedResult> {
  const index = await getContentIndex();
  const bySegment = indexByFinalSegment(index);

  const links: RelatedLink[] = [];
  const failures: ResolutionFailure[] = [];
  const seen = new Set<string>([doc.slug]);

  for (const reference of doc.frontmatter.relatedTopics) {
    const resolved = resolveReference(index, bySegment, reference);
    if ('reason' in resolved) {
      failures.push(resolved);
      continue;
    }
    if (seen.has(resolved.slug)) continue;
    seen.add(resolved.slug);
    links.push(toLink(resolved));
  }

  return {
    links,
    suggested: links.length === 0 ? suggestByTags(index, doc, seen) : [],
    failures,
  };
}

/** All tags in use, with counts — the basis for future tag pages and filters. */
export async function getTagCounts(): Promise<Map<string, number>> {
  const index = await getContentIndex();
  const counts = new Map<string, number>();
  for (const doc of index.docs) {
    for (const tag of doc.frontmatter.tags) {
      const key = tag.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return new Map([...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

export { indexByFinalSegment };
