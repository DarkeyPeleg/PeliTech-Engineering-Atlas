import MiniSearch from 'minisearch';
import {
  SEARCH_INDEX_PATH,
  SEARCH_INDEX_VERSION,
  type SearchDocument,
  type SearchIndexFile,
} from './types';

/**
 * Client-side search over the static index.
 *
 * The index is fetched on first use — not on page load — so search costs nothing
 * until someone opens it. MiniSearch is a few kilobytes and runs entirely in the
 * browser, which keeps the whole site statically hostable with no search service.
 */

export interface SearchHit {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string | null;
  tags: string[];
  score: number;
}

let loader: Promise<MiniSearch<SearchDocument>> | null = null;
const documentsBySlug = new Map<string, SearchDocument>();

async function load(): Promise<MiniSearch<SearchDocument>> {
  const response = await fetch(SEARCH_INDEX_PATH);
  if (!response.ok) {
    throw new Error(`Could not load the search index (${response.status})`);
  }

  const file = (await response.json()) as SearchIndexFile;
  if (file.version !== SEARCH_INDEX_VERSION) {
    throw new Error('The search index is out of date. Rebuild with `npm run search:index`.');
  }

  const miniSearch = new MiniSearch<SearchDocument>({
    fields: ['title', 'tags', 'description', 'headings', 'category', 'body'],
    storeFields: ['title', 'description', 'category', 'difficulty', 'tags'],
    searchOptions: {
      prefix: true,
      fuzzy: 0.15,
      // A title match should outrank a body mention of the same word.
      boost: { title: 6, tags: 4, headings: 3, description: 2, category: 2 },
    },
  });

  for (const document of file.documents) documentsBySlug.set(document.id, document);
  miniSearch.addAll(file.documents);

  return miniSearch;
}

export function loadSearchIndex(): Promise<MiniSearch<SearchDocument>> {
  loader ??= load().catch((error: unknown) => {
    // Allow a retry after a transient failure.
    loader = null;
    throw error;
  });
  return loader;
}

export async function search(query: string, limit = 10): Promise<SearchHit[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const miniSearch = await loadSearchIndex();

  return miniSearch
    .search(trimmed)
    .slice(0, limit)
    .map((result) => {
      const document = documentsBySlug.get(String(result.id));
      return {
        slug: String(result.id),
        title: document?.title ?? String(result.id),
        description: document?.description ?? '',
        category: document?.category ?? '',
        difficulty: document?.difficulty ?? null,
        tags: document?.tags ?? [],
        score: result.score,
      };
    });
}
