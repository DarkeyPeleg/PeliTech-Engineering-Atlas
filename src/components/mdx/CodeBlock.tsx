import type { ComponentPropsWithoutRef } from 'react';
import { languageLabel } from '@/lib/content/shiki';
import { CopyButton } from './CopyButton';

/**
 * Chrome around a highlighted code block — the Dark Panel treatment from
 * design.md, with a language chip and copy button.
 *
 * Registered as the `pre` override in src/mdx-components.tsx, so it wraps every
 * fenced code block automatically. `data-raw` is attached by
 * src/lib/content/plugins/rehype-code-raw.ts.
 */

type PreProps = ComponentPropsWithoutRef<'pre'> & {
  'data-raw'?: string;
  'data-language'?: string;
  /** Set by rehype-pretty-code from ```ts title="server.ts" */
  'data-title'?: string;
};

export function CodeBlock({
  'data-raw': raw,
  'data-language': language,
  'data-title': title,
  children,
  ...props
}: PreProps) {
  const label = languageLabel(language);

  return (
    <div className="code-block my-24 overflow-hidden rounded-inputs bg-surface-inverted">
      {(title || label || raw) && (
        <div className="flex items-center justify-between gap-16 border-b border-ink-inverted/10 px-20 py-8">
          <span className="truncate font-mono text-caption text-ink-inverted/70">
            {title ?? label ?? ''}
          </span>
          <div className="flex shrink-0 items-center gap-8">
            {title && label ? (
              <span className="font-charlie-text text-caption text-ink-inverted/50">{label}</span>
            ) : null}
            {raw ? <CopyButton text={raw} /> : null}
          </div>
        </div>
      )}
      <pre tabIndex={-1} {...props}>
        {children}
      </pre>
    </div>
  );
}

export default CodeBlock;
