import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderMdx } from '../src/lib/content/mdx';

/**
 * Regression guard for the MDX pipeline.
 *
 * This exists because of a failure mode that produces no error at all: when
 * `blockJS` is left at its default, next-mdx-remote strips JSX attribute
 * expressions, so `<ComparisonTable options={[...]} />` renders with `options`
 * undefined. Nothing warns — components just receive nothing.
 *
 * A build cannot catch that on its own, so these assertions check the pipeline's
 * contract directly: diagrams become components, languages resolve, copy text is
 * captured, and structured props survive compilation.
 */

const SOURCE = `## Heading with anchor

Prose with \`inline code\`, a [link](/databases/indexing) and **emphasis**.

| Aspect | A | B |
| --- | --- | --- |
| Cost | Low | High |

\`\`\`ts title="server.ts"
export const value: number = 1;
\`\`\`

\`\`\`al
codeunit 50100 "Handler"
{
    procedure Post(Amount: Decimal): Integer
    begin
        exit(1);
    end;
}
\`\`\`

\`\`\`nonexistent-language
plain text
\`\`\`

\`\`\`mermaid caption="A sequence"
sequenceDiagram
    participant User
    User->>API: Request
\`\`\`

<Probe strings={['a', 'b']} rows={[{ key: 'value' }]} text="literal" count={3} />
`;

const probeProps: Record<string, unknown>[] = [];

async function main(): Promise<void> {
  const element = await renderMdx(SOURCE, {
    pre: (props: Record<string, unknown>) =>
      createElement('pre', {
        'data-language': props['data-language'],
        'data-raw-length': String((props['data-raw'] as string | undefined)?.length ?? 0),
      }),
    Mermaid: (props: { chart: string; caption?: string }) =>
      createElement('div', {
        'data-mermaid': 'true',
        'data-caption': props.caption ?? '',
        'data-chart-length': String(props.chart.length),
      }),
    Probe: (props: Record<string, unknown>) => {
      probeProps.push(props);
      return createElement('div');
    },
  });

  const html = renderToStaticMarkup(element);
  const probe = probeProps[0] ?? {};

  const checks: [string, boolean][] = [
    ['heading ids are generated', html.includes('id="heading-with-anchor"')],
    [
      'heading permalinks are added and labelled',
      html.includes('aria-label="Permalink to this section"'),
    ],
    ['GFM tables render', html.includes('<table>')],
    ['mermaid fences become components', html.includes('data-mermaid="true"')],
    ['mermaid captions pass through', html.includes('data-caption="A sequence"')],
    ['mermaid source is preserved', /data-chart-length="[1-9]\d+"/.test(html)],
    ['language aliases resolve (ts -> typescript)', html.includes('data-language="typescript"')],
    ['the custom AL grammar is applied', html.includes('data-language="al"')],
    ['unknown languages fall back to text', html.includes('data-language="text"')],
    ['copy text is captured on the pre element', /data-raw-length="[1-9]\d+"/.test(html)],
    ['inline code is not sent to the highlighter', html.includes('<code>inline code</code>')],
    // The silent failure this script exists for:
    ['array props reach components', Array.isArray(probe['strings'])],
    ['object-array props reach components', Array.isArray(probe['rows'])],
    ['numeric props reach components', probe['count'] === 3],
    ['string props reach components', probe['text'] === 'literal'],
  ];

  const failures = checks.filter(([, pass]) => !pass);

  for (const [label, pass] of checks) {
    console.log(`${pass ? 'ok  ' : 'FAIL'} ${label}`);
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} pipeline check(s) failed.`);
    process.exit(1);
  }

  console.log(`\nMDX pipeline: ${checks.length} checks passed`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
