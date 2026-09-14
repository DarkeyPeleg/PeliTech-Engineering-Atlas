import fs from 'node:fs/promises';
import path from 'node:path';
import { getContentIndex } from '../src/lib/content/source';
import { indexByFinalSegment, resolveReference } from '../src/lib/content/related';
import { normalizeSlug } from '../src/lib/content/paths';

/**
 * Content and design-system quality gate, run in CI.
 *
 * Frontmatter validity and duplicate routes are already enforced by the content
 * layer, which throws while building the index. What this adds is everything that
 * only becomes visible across the whole corpus: dangling internal links,
 * unresolvable related topics, unclosed diagram fences, and design tokens being
 * bypassed in components.
 */

interface Problem {
  file: string;
  message: string;
}

const problems: Problem[] = [];
const warnings: Problem[] = [];

function fail(file: string, message: string): void {
  problems.push({ file, message });
}

function warn(file: string, message: string): void {
  warnings.push({ file, message });
}

/* ---------------------------------------------------------------------------
 * Content checks
 * ------------------------------------------------------------------------ */

const INTERNAL_LINK = /\]\((\/[^)\s#]*)(#[^)\s]*)?\)/g;
const FENCE = /^([`~]{3,})\s*(\S*)/;

async function checkContent(): Promise<void> {
  const index = await getContentIndex();
  const bySegment = indexByFinalSegment(index);
  const routes = new Set<string>([
    ...index.docs.map((doc) => doc.slug),
    ...index.dirs.map((dir) => dir.slug),
  ]);

  if (index.docs.length === 0) {
    fail('docs/', 'no content found');
    return;
  }

  for (const doc of index.docs) {
    const file = `docs/${doc.relativePath}`;

    // Descriptions are the meta description and the search summary; a stub one
    // is worse than a missing field because it silently ships.
    if (doc.frontmatter.description.length < 40) {
      warn(file, `description is only ${doc.frontmatter.description.length} characters`);
    }
    if (doc.frontmatter.title.length > 70) {
      warn(file, `title is ${doc.frontmatter.title.length} characters; may be truncated in search results`);
    }

    // Related topics must resolve, or a rename leaves dangling links.
    for (const reference of doc.frontmatter.relatedTopics) {
      const resolved = resolveReference(index, bySegment, reference);
      if ('reason' in resolved) {
        fail(
          file,
          resolved.reason === 'ambiguous'
            ? `relatedTopics "${reference}" is ambiguous (matches ${resolved.candidates.join(', ')})`
            : `relatedTopics "${reference}" does not resolve to an article`,
        );
      }
    }

    // Internal links must point at real routes.
    for (const match of doc.body.matchAll(INTERNAL_LINK)) {
      const target = normalizeSlug(match[1] ?? '');
      if (!target || target === 'styleguide') continue;
      if (!routes.has(target)) {
        fail(file, `link to /${target} does not match any route`);
      }
    }

    // Unbalanced fences silently swallow the rest of an article.
    let fenceMarker: string | null = null;
    for (const line of doc.body.split('\n')) {
      const fence = FENCE.exec(line.trim());
      if (!fence?.[1]) continue;
      if (fenceMarker === null) {
        fenceMarker = fence[1];
      } else if (fence[1].startsWith(fenceMarker[0]!) && fence[1].length >= fenceMarker.length) {
        fenceMarker = null;
      }
    }
    if (fenceMarker !== null) {
      fail(file, 'unclosed code fence');
    }

    // A heading structure is what makes the table of contents useful.
    if (doc.frontmatter.toc && !doc.isSectionIndex && doc.toc.length === 0 && doc.body.length > 2000) {
      warn(file, 'long article has no "##" headings, so it gets no table of contents');
    }
  }
}

/* ---------------------------------------------------------------------------
 * Design-token checks
 *
 * design.md is the styling contract; these keep it from eroding one hardcoded
 * value at a time. theme.css is the only file allowed to hold literal colours.
 * ------------------------------------------------------------------------ */

const HEX_COLOR = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/;
const BRAND_TOKEN = /(?:bg|text|border|fill|stroke|ring|from|to|via)-brand-/;
const COMPONENT_ROOTS = ['src/components', 'src/app', 'src/lib'];
/**
 * theme.css is the source of truth; lib/design-tokens.ts mirrors it for the two
 * consumers that cannot read a CSS variable (the theme-color meta tag, and
 * Mermaid's JavaScript config).
 */
const TOKEN_EXEMPT = ['src/app/theme.css', 'src/lib/design-tokens.ts'];

async function walkFiles(dir: string, out: string[]): Promise<void> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(full, out);
    } else if (/\.(tsx?|css)$/.test(entry.name)) {
      out.push(full);
    }
  }
}

async function checkDesignTokens(): Promise<void> {
  const files: string[] = [];
  for (const root of COMPONENT_ROOTS) {
    await walkFiles(path.join(process.cwd(), root), files);
  }

  for (const absolute of files) {
    const relative = path.relative(process.cwd(), absolute).split(path.sep).join('/');
    if (TOKEN_EXEMPT.includes(relative)) continue;

    const source = await fs.readFile(absolute, 'utf8');
    const lines = source.split('\n');

    for (const [lineIndex, line] of lines.entries()) {
      // Skip comments, which legitimately quote design.md values.
      const trimmed = line.trim();
      if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) continue;

      if (HEX_COLOR.test(line)) {
        fail(
          relative,
          `line ${lineIndex + 1}: hardcoded colour "${HEX_COLOR.exec(line)?.[0]}" — use a semantic token from theme.css`,
        );
      }
      if (BRAND_TOKEN.test(line)) {
        fail(
          relative,
          `line ${lineIndex + 1}: uses a --brand-* token directly — components must use semantic aliases (bg-surface, text-ink-muted, text-accent)`,
        );
      }
    }
  }
}

/* ------------------------------------------------------------------------ */

async function main(): Promise<void> {
  await checkContent();
  await checkDesignTokens();

  for (const warning of warnings) {
    console.warn(`warn  ${warning.file}: ${warning.message}`);
  }

  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`error ${problem.file}: ${problem.message}`);
    }
    console.error(`\n${problems.length} problem(s) found.`);
    process.exit(1);
  }

  console.log(
    `content and tokens valid${warnings.length > 0 ? ` (${warnings.length} warning(s))` : ''}`,
  );
}

main().catch((error: unknown) => {
  // Content-layer errors (bad frontmatter, duplicate routes) surface here.
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
