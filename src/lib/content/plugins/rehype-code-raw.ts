import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

/**
 * Attaches the plain source text of every code block to its `<pre>` as
 * `data-raw`, so the copy button can copy real code rather than reconstructing
 * it from highlighted spans.
 *
 * Runs after rehype-pretty-code, on the final highlighted tree: the token
 * elements still contain exactly the original characters, and reading them here
 * means the copy path can never drift from what is displayed.
 */

function textContent(node: Element | Root): string {
  let out = '';
  for (const child of node.children) {
    if (child.type === 'text') out += child.value;
    else if (child.type === 'element') out += textContent(child);
  }
  return out;
}

export function rehypeCodeRaw() {
  return (tree: Root): void => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'pre') return;

      const code = node.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code',
      );
      if (!code) return;

      // rehype-pretty-code renders one element per line; joining their text
      // rebuilds the source, but line elements do not carry trailing newlines.
      const lines = code.children.filter(
        (child): child is Element =>
          child.type === 'element' && child.properties?.['dataLine'] !== undefined,
      );

      const raw = lines.length > 0 ? lines.map((line) => textContent(line)).join('\n') : textContent(code);

      node.properties = { ...node.properties, 'data-raw': raw };
    });
  };
}

export default rehypeCodeRaw;
