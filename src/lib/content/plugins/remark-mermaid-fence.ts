import { visit } from 'unist-util-visit';
import type { Code, Parent, Root } from 'mdast';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

/**
 * Turns a plain ```mermaid fence into `<Mermaid chart="..." />`.
 *
 * This is what keeps diagrams authorable: a contributor writes a fenced code
 * block and never touches a React component. Optional metadata on the fence
 * becomes props:
 *
 *   ```mermaid caption="Checkout sequence"
 *   sequenceDiagram
 *     ...
 *   ```
 */

const MERMAID_LANGUAGES = new Set(['mermaid', 'mmd']);

function readMetaValue(meta: string | null | undefined, key: string): string | undefined {
  if (!meta) return undefined;
  const match = new RegExp(`${key}="([^"]*)"`).exec(meta);
  return match?.[1];
}

export function remarkMermaidFence() {
  return (tree: Root): void => {
    visit(tree, 'code', (node: Code, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined) return;
      if (!node.lang || !MERMAID_LANGUAGES.has(node.lang.toLowerCase())) return;

      const caption = readMetaValue(node.meta, 'caption') ?? readMetaValue(node.meta, 'title');

      const element: MdxJsxFlowElement = {
        type: 'mdxJsxFlowElement',
        name: 'Mermaid',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'chart', value: node.value },
          ...(caption
            ? [{ type: 'mdxJsxAttribute' as const, name: 'caption', value: caption }]
            : []),
        ],
        children: [],
      };

      parent.children[index] = element;
    });
  };
}

export default remarkMermaidFence;
