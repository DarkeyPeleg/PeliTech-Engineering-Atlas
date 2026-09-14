'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { mermaidConfig, withClassDefs } from '@/lib/content/mermaid-theme';

/**
 * Renders a Mermaid diagram from a fenced code block.
 *
 * Authors never use this component directly — `remark-mermaid-fence` rewrites
 * ```mermaid fences into it, so adding a diagram is writing a code fence.
 *
 * Mermaid is a few hundred kilobytes, so it is imported dynamically the first
 * time a diagram scrolls into view. A page with no diagrams pays nothing, and a
 * page with ten only loads the library once.
 */

interface MermaidProps {
  chart: string;
  caption?: string;
}

/*
 * There is no distinct `loading` state because it would render identically to
 * `pending`: the diagram is either on screen or it is not. Keeping the machine at
 * three states means every transition happens in an async callback, so the
 * component never sets state synchronously during an effect.
 */
type RenderState =
  { status: 'pending' } | { status: 'ready'; svg: string } | { status: 'error'; message: string };

export function Mermaid({ chart, caption }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RenderState>({ status: 'pending' });
  // Mermaid requires a DOM-safe, unique id per diagram.
  const domId = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let cancelled = false;

    async function render(): Promise<void> {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize(mermaidConfig);
        const { svg } = await mermaid.render(domId, withClassDefs(chart));
        if (!cancelled) setState({ status: 'ready', svg });
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Diagram failed to render',
          });
        }
      }
    }

    // Without IntersectionObserver, render straight away rather than leaving the
    // diagram permanently blank.
    if (typeof IntersectionObserver === 'undefined') {
      void render();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void render();
        }
      },
      // Start loading slightly before the diagram reaches the viewport.
      { rootMargin: '200px' },
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [chart, domId]);

  return (
    <figure className="my-32">
      <div
        ref={containerRef}
        // Reserve height so loading a diagram does not shift the article.
        className="flex min-h-[120px] items-center justify-center overflow-x-auto rounded-cards border border-border-subtle bg-surface p-24 [&_svg]:h-auto [&_svg]:max-w-full"
      >
        {state.status === 'ready' ? (
          // Mermaid output, generated from author-written diagram source in the
          // repository and rendered with securityLevel 'strict'.
          <div dangerouslySetInnerHTML={{ __html: state.svg }} />
        ) : state.status === 'error' ? (
          <div className="w-full text-left">
            <p className="font-charlie-text text-caption font-medium text-ink">
              This diagram could not be rendered.
            </p>
            <p className="mt-4 font-charlie-text text-caption text-ink-muted">{state.message}</p>
            <pre className="mt-12 overflow-x-auto rounded-inputs bg-surface-soft p-12 font-mono text-caption text-ink-body">
              {chart}
            </pre>
          </div>
        ) : (
          <span className="font-charlie-text text-caption text-ink-muted">Loading diagram…</span>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-8 font-charlie-text text-caption text-ink-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default Mermaid;
