import Link from 'next/link';
import type { Breadcrumb } from '@/lib/content/tree';

export function Breadcrumbs({ crumbs }: { crumbs: Breadcrumb[] }) {
  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex list-none flex-wrap items-center gap-8">
        <li>
          <Link
            href="/"
            className="font-charlie-text text-caption text-ink-muted transition-colors hover:text-accent"
          >
            Home
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-8">
              <span aria-hidden="true" className="font-charlie-text text-caption text-ink-muted">
                /
              </span>
              {isLast ? (
                <span aria-current="page" className="font-charlie-text text-caption text-ink">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="font-charlie-text text-caption text-ink-muted transition-colors hover:text-accent"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
