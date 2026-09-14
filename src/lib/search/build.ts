import { getAllDocs } from '../content/source';
import { toSearchableText } from '../content/toc';
import { SEARCH_INDEX_VERSION, type SearchDocument, type SearchIndexFile } from './types';

/**
 * Builds the static search index.
 *
 * Bodies are truncated because the index is downloaded whole by the browser. At
 * roughly 2.5 KB of text per article this stays well inside a single request for
 * hundreds of articles; scripts/build-search-index.ts prints the resulting size
 * so growth is visible rather than discovered in production.
 */

export const MAX_BODY_CHARS = 2500;

function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  // Avoid slicing a word in half.
  const lastSpace = cut.lastIndexOf(' ');
  return lastSpace > limit * 0.8 ? cut.slice(0, lastSpace) : cut;
}

export async function buildSearchIndex(): Promise<SearchIndexFile> {
  const docs = await getAllDocs();

  const documents: SearchDocument[] = docs
    .filter((doc) => !doc.frontmatter.draft)
    .map((doc) => ({
      id: doc.slug,
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      category: doc.category,
      tags: doc.frontmatter.tags,
      difficulty: doc.frontmatter.difficulty ?? null,
      headings: doc.toc.map((entry) => entry.title).join(' · '),
      body: truncate(toSearchableText(doc.body), MAX_BODY_CHARS),
    }));

  return {
    version: SEARCH_INDEX_VERSION,
    generatedAt: new Date().toISOString(),
    documents,
  };
}
