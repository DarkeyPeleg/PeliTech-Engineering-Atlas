import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode, { type Options as PrettyCodeOptions } from 'rehype-pretty-code';
import type { MDXComponents } from 'mdx/types';
import type { ReactElement } from 'react';
import { CODE_THEME, getHighlighter } from './shiki';
import { remarkMermaidFence } from './plugins/remark-mermaid-fence';
import { remarkNormalizeCodeLang } from './plugins/remark-normalize-code-lang';
import { rehypeCodeRaw } from './plugins/rehype-code-raw';

/**
 * The one place MDX is compiled.
 *
 * Everything about how content becomes HTML lives here, so the rest of the app
 * knows nothing about remark, rehype or Shiki — and swapping the renderer later
 * (for `@mdx-js/mdx` directly, say) is a change to this file alone.
 *
 * Plugin order matters:
 *   1. remarkMermaidFence      — claims ```mermaid fences before they can be highlighted
 *   2. remarkNormalizeCodeLang — maps aliases onto the Shiki allowlist
 *   3. remarkGfm               — tables, footnotes, task lists, strikethrough
 *   4. rehypeSlug              — heading ids that match src/lib/content/toc.ts
 *   5. rehypeAutolinkHeadings  — the hover anchor beside each heading
 *   6. rehypePrettyCode        — build-time highlighting, no client-side JS
 *   7. rehypeCodeRaw           — stashes source text for the copy button
 */

const prettyCodeOptions: PrettyCodeOptions = {
  theme: CODE_THEME,
  // Our CSS owns the block surface (design.md, Dark Panel treatment).
  keepBackground: false,
  defaultLang: 'text',
  bypassInlineCode: true,
  getHighlighter: () => getHighlighter(),
};

export async function renderMdx(source: string, components: MDXComponents): Promise<ReactElement> {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      // Frontmatter is parsed by gray-matter in the content layer, and the body
      // handed here already has it stripped.
      parseFrontmatter: false,

      /*
       * next-mdx-remote defaults to stripping every JavaScript expression,
       * because its usual job is rendering MDX submitted by strangers. That
       * silently deletes JSX attribute expressions, so
       * `<ComparisonTable options={['REST', 'GraphQL']} />` would arrive with
       * `options` undefined.
       *
       * Our content is first-party: it lives in this repository, arrives through
       * reviewed pull requests, and is compiled at build time — the same trust
       * level as the application's own source. So expressions are enabled, while
       * `blockDangerousJS` (left at its default) still refuses `eval`,
       * `Function`, `process`, `require` and prototype access.
       *
       * If this site ever renders MDX from an untrusted source, that path must
       * not reuse this function.
       */
      blockJS: false,
      blockDangerousJS: true,
      mdxOptions: {
        remarkPlugins: [remarkMermaidFence, remarkNormalizeCodeLang, remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'append',
              // Focusable and labelled, so keyboard users can reach the permalink.
              properties: {
                className: ['heading-anchor'],
                ariaLabel: 'Permalink to this section',
              },
              content: { type: 'text', value: '#' },
            },
          ],
          [rehypePrettyCode, prettyCodeOptions],
          rehypeCodeRaw,
        ],
        format: 'mdx',
      },
    },
  });

  return content;
}
