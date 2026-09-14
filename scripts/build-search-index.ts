import fs from 'node:fs/promises';
import path from 'node:path';
import { buildSearchIndex, MAX_BODY_CHARS } from '../src/lib/search/build';

/**
 * Writes public/search-index.json. Runs as `prebuild` and `predev`, so the index
 * can never be missing or stale relative to the content.
 *
 * The size report is the early-warning system for the one scaling limit of this
 * search design: the whole index is downloaded by the browser on first search.
 */

const OUTPUT = path.join(process.cwd(), 'public', 'search-index.json');
const SIZE_WARNING_BYTES = 1_000_000;

async function main(): Promise<void> {
  const index = await buildSearchIndex();
  const json = JSON.stringify(index);

  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, json, 'utf8');

  const bytes = Buffer.byteLength(json, 'utf8');
  const kilobytes = (bytes / 1024).toFixed(1);
  const perDoc = index.documents.length > 0 ? Math.round(bytes / index.documents.length) : 0;

  console.log(
    `search index: ${index.documents.length} documents, ${kilobytes} KB (~${perDoc} B/doc, bodies capped at ${MAX_BODY_CHARS} chars)`,
  );

  if (bytes > SIZE_WARNING_BYTES) {
    console.warn(
      `warning: the search index is over ${SIZE_WARNING_BYTES / 1000} KB. Consider chunking it or moving search behind a route — see src/lib/search/build.ts.`,
    );
  }
}

main().catch((error: unknown) => {
  console.error('Failed to build the search index.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
