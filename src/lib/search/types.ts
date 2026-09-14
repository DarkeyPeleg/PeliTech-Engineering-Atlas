/**
 * The shape of `public/search-index.json`, shared between the build script that
 * writes it and the client that queries it.
 */

export interface SearchDocument {
  /** MiniSearch requires a scalar id; the slug is already unique. */
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: string | null;
  /** Section headings, which are strong signals for query matching. */
  headings: string;
  /** Truncated plain-text body — see MAX_BODY_CHARS in build.ts. */
  body: string;
}

export interface SearchIndexFile {
  /** Bumped when the document shape changes, so a stale cached index is ignored. */
  version: number;
  generatedAt: string;
  documents: SearchDocument[];
}

export const SEARCH_INDEX_VERSION = 1;
export const SEARCH_INDEX_PATH = '/search-index.json';
