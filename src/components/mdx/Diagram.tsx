import type { ReactNode } from 'react';

/**
 * Figure wrapper with a caption, for anything that is not a Mermaid fence —
 * a table used as a diagram, an ASCII layout, an embedded SVG.
 *
 * Mermaid fences produce their own figure and caption, so they do not need this.
 */
export function Diagram({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="my-32">
      <div className="overflow-x-auto rounded-cards border border-border-subtle bg-surface p-24">
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-8 font-charlie-text text-caption text-ink-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default Diagram;
