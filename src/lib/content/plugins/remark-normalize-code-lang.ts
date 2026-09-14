import { visit } from 'unist-util-visit';
import type { Code, Root } from 'mdast';
import { PLAIN_LANGUAGE, resolveLanguage } from '../shiki';

/**
 * Maps fence languages onto the Shiki allowlist before highlighting runs.
 *
 * Aliases (`ts`, `sh`, `yml`) are expanded and anything we have not loaded a
 * grammar for falls back to plain text, so an unrecognised language in an
 * article degrades to unhighlighted code instead of failing the build.
 */
export function remarkNormalizeCodeLang() {
  return (tree: Root): void => {
    visit(tree, 'code', (node: Code) => {
      // Mermaid fences are removed by remarkMermaidFence before this runs.
      if (!node.lang) {
        node.lang = PLAIN_LANGUAGE;
        return;
      }
      node.lang = resolveLanguage(node.lang);
    });
  };
}

export default remarkNormalizeCodeLang;
