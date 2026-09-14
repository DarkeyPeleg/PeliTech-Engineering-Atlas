'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '@/lib/content/toc';
import { cn } from '@/lib/utils/cn';

/**
 * On-page table of contents with a reading position indicator.
 *
 * Uses IntersectionObserver rather than scroll maths: it costs no work on the
 * main thread while scrolling, which matters on the long case-study pages.
 */
export function Toc({ entries }: { entries: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;

    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
          return;
        }

        // Nothing intersecting: keep the last heading scrolled past highlighted.
        const above = headings.filter((heading) => heading.getBoundingClientRect().top < 100);
        setActiveId(above.at(-1)?.id ?? null);
      },
      // The top band of the viewport is what counts as "current".
      { rootMargin: '-80px 0px -70% 0px', threshold: [0, 1] },
    );

    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="On this page">
      <p className="mb-12 font-charlie-text text-caption font-medium tracking-wide text-ink uppercase">
        On this page
      </p>
      <ul className="list-none">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={activeId === entry.id ? 'location' : undefined}
              className={cn(
                'block border-l py-4 font-charlie-text text-caption transition-colors',
                entry.depth === 3 ? 'pl-20' : 'pl-12',
                activeId === entry.id
                  ? 'border-accent text-accent'
                  : 'border-border-subtle text-ink-muted hover:border-ink-muted hover:text-ink',
              )}
            >
              {entry.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
