import type { JsonLd } from '@/lib/seo';

/**
 * Emits JSON-LD. The payload is built from our own frontmatter, never from user
 * input, and `JSON.stringify` output is escaped for the one sequence that could
 * terminate the script element early.
 */
export function StructuredData({ data }: { data: JsonLd | JsonLd[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
