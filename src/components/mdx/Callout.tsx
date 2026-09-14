import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Aside blocks for the recurring editorial notes in engineering writing.
 *
 * They are differentiated by label and surface, not by color: design.md reserves
 * yellow, violet and green for decoration and forbids them in functional UI, so
 * there is no red "danger" callout here. The label carries the meaning.
 */

type Tone = 'neutral' | 'accent' | 'strong';

const tones: Record<Tone, string> = {
  neutral: 'border-border-subtle bg-surface-soft',
  accent: 'border-accent-soft bg-accent-soft',
  strong: 'border-ink bg-surface',
};

interface CalloutProps {
  children: ReactNode;
  /** Short heading, e.g. "Security", "Common mistake". */
  label?: string;
  tone?: Tone;
  className?: string;
}

export function Callout({ children, label, tone = 'neutral', className }: CalloutProps) {
  return (
    <aside
      className={cn(
        'my-24 rounded-cards border-l-2 px-20 py-16',
        // Only the left edge is emphasised, keeping the system flat.
        tones[tone],
        className,
      )}
    >
      {label ? (
        <p className="mb-8 font-charlie-text text-caption font-medium tracking-wide text-ink uppercase">
          {label}
        </p>
      ) : null}
      <div className="callout-body text-ink-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}

/* Named wrappers so articles read declaratively and labels stay consistent
 * across hundreds of pages. */

export function Note({ children }: { children: ReactNode }) {
  return <Callout label="Note">{children}</Callout>;
}

export function Tip({ children }: { children: ReactNode }) {
  return (
    <Callout label="In practice" tone="accent">
      {children}
    </Callout>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <Callout label="Watch out" tone="strong">
      {children}
    </Callout>
  );
}

export function SecurityNote({ children }: { children: ReactNode }) {
  return (
    <Callout label="Security" tone="strong">
      {children}
    </Callout>
  );
}

export function ScalabilityNote({ children }: { children: ReactNode }) {
  return (
    <Callout label="At scale" tone="accent">
      {children}
    </Callout>
  );
}

export function CommonMistake({ children }: { children: ReactNode }) {
  return (
    <Callout label="Common mistake" tone="strong">
      {children}
    </Callout>
  );
}

export default Callout;
