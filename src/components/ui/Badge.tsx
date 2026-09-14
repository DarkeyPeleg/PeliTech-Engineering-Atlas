import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Metadata pill, per design.md: full pill radius, 13px medium text, muted indigo
 * on fog white, or the brand-tinted variant.
 */

type Tone = 'neutral' | 'accent' | 'inverted';

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-soft text-ink-muted',
  accent: 'bg-accent-soft text-accent',
  // For use on dark panels only.
  inverted: 'bg-ink-inverted/10 text-ink-inverted',
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-8 py-4 font-charlie-text text-caption font-medium whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
