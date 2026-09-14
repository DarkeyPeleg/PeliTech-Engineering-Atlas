import GithubSlugger from 'github-slugger';

/**
 * Table of contents, extracted from the raw markdown rather than from the
 * compiled tree, so scripts (search index, validation) can build a TOC without
 * running the MDX compiler.
 *
 * ids come from the same slugger `rehype-slug` uses, so anchors always match.
 * Only markdown ATX headings are collected: a heading rendered inside a JSX
 * component will not appear here, which is why the section primitives in
 * src/components/mdx never render their own headings.
 */

export interface TocEntry {
  id: string;
  title: string;
  depth: 2 | 3;
}

const HEADING = /^(#{2,3})\s+(.+?)\s*#*\s*$/;
const FENCE = /^([`~]{3,})/;

/** Removes markdown emphasis, inline code and links from heading text. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export function extractToc(markdown: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];

  let fenceMarker: string | null = null;

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trimEnd();
    const fence = FENCE.exec(line.trim());

    if (fence?.[1]) {
      if (fenceMarker === null) {
        fenceMarker = fence[1];
      } else if (fence[1].startsWith(fenceMarker[0]!) && fence[1].length >= fenceMarker.length) {
        fenceMarker = null;
      }
      continue;
    }

    if (fenceMarker !== null) continue;

    const match = HEADING.exec(line);
    if (!match?.[1] || !match[2]) continue;

    const title = toPlainText(match[2]);
    if (!title) continue;

    entries.push({
      id: slugger.slug(title),
      title,
      depth: match[1].length === 2 ? 2 : 3,
    });
  }

  return entries;
}

/** Plain-text body for the search index: no fences, JSX, tables or link syntax. */
export function toSearchableText(markdown: string): string {
  const lines: string[] = [];
  let fenceMarker: string | null = null;

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();
    const fence = FENCE.exec(line);

    if (fence?.[1]) {
      if (fenceMarker === null) {
        fenceMarker = fence[1];
      } else if (fence[1].startsWith(fenceMarker[0]!) && fence[1].length >= fenceMarker.length) {
        fenceMarker = null;
      }
      continue;
    }

    if (fenceMarker !== null) continue;
    if (!line) continue;
    // Skip JSX-only lines and markdown table rules.
    if (/^<\/?[A-Z]/.test(line) || /^\|?[\s:|-]+\|[\s:|-]*$/.test(line)) continue;

    lines.push(toPlainText(line.replace(/^[#>\s*-]+/, '')));
  }

  return lines.join(' ').replace(/\s+/g, ' ').trim();
}
