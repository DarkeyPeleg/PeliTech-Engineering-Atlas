import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Content card, per design.md: 20px radius, 24px padding, hairline border,
 * no drop shadow — "the radius and whitespace do the lifting".
 */

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-cards border border-border-subtle bg-surface p-24',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface LinkCardProps extends CardProps {
  href: string;
}

/** A card that is entirely one link. Hover raises the border, not a shadow. */
export function LinkCard({ href, children, className }: LinkCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group block rounded-cards border border-border-subtle bg-surface p-24 transition-colors',
        'hover:border-accent',
        className,
      )}
    >
      {children}
    </Link>
  );
}
