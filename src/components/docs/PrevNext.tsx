import Link from 'next/link';
import type { Siblings } from '@/lib/content/tree';

/**
 * Sequential navigation in the sidebar's reading order, so the whole knowledge
 * base can be read front to back without going back to a listing page.
 */
export function PrevNext({ previous, next }: Siblings) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Previous and next article"
      className="mt-48 grid gap-16 border-t border-border-subtle pt-24 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={previous.href}
          className="group rounded-cards border border-border-subtle p-16 transition-colors hover:border-accent"
        >
          <span className="font-charlie-text text-caption text-ink-muted">Previous</span>
          <span className="mt-4 block font-charlie-text text-body font-medium text-ink group-hover:text-accent">
            {previous.label}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group rounded-cards border border-border-subtle p-16 text-right transition-colors hover:border-accent sm:col-start-2"
        >
          <span className="font-charlie-text text-caption text-ink-muted">Next</span>
          <span className="mt-4 block font-charlie-text text-body font-medium text-ink group-hover:text-accent">
            {next.label}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
