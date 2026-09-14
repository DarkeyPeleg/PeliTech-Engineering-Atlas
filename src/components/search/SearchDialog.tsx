'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { search, type SearchHit } from '@/lib/search/client';
import { Badge } from '@/components/ui/Badge';

/**
 * Search overlay: title, description, category, tag, heading and body matching
 * over the static index, with keyboard navigation.
 */

/**
 * An outcome carries the query that produced it. That turns "are we still
 * waiting?" into a comparison at render time, so no effect has to synchronise a
 * status field with the input — and none of these transitions happen
 * synchronously during an effect.
 */
type Outcome =
  | { query: string; status: 'ready'; hits: SearchHit[] }
  | { query: string; status: 'error'; message: string };

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const trimmed = query.trim();
  const tooShort = trimmed.length < 2;

  const current = outcome?.query === trimmed ? outcome : null;
  // Memoised so the empty case is a stable reference, keeping the keyboard
  // handler below from being rebuilt on every keystroke.
  const hits = useMemo(() => (current?.status === 'ready' ? current.hits : []), [current]);
  const searching = !tooShort && current === null;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Debounced so typing does not re-query the index on every keystroke.
  useEffect(() => {
    if (tooShort) return;

    let cancelled = false;

    const timer = window.setTimeout(() => {
      void search(trimmed)
        .then((results) => {
          if (cancelled) return;
          setOutcome({ query: trimmed, status: 'ready', hits: results });
          setActiveIndex(0);
        })
        .catch((cause: unknown) => {
          if (cancelled) return;
          setOutcome({
            query: trimmed,
            status: 'error',
            message: cause instanceof Error ? cause.message : 'Search is unavailable.',
          });
        });
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [trimmed, tooShort]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (hits.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % hits.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + hits.length) % hits.length);
      } else if (event.key === 'Enter') {
        const hit = hits[activeIndex];
        if (hit) {
          event.preventDefault();
          router.push(`/${hit.slug}`);
          onClose();
        }
      }
    },
    [activeIndex, hits, onClose, router],
  );

  const message = useMemo(() => {
    if (current?.status === 'error') return current.message;
    if (tooShort) return 'Type at least two characters.';
    if (searching) return 'Searching…';
    if (hits.length === 0) return `No results for “${trimmed}”.`;
    return null;
  }, [current, hits.length, searching, tooShort, trimmed]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-20 pt-80">
      {/* Backdrop. Navy-tinted rather than neutral black, per design.md. */}
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-surface-inverted/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the knowledge base"
        onKeyDown={onKeyDown}
        className="relative w-full max-w-[640px] overflow-hidden rounded-cards border border-border-subtle bg-surface shadow-subtle"
      >
        <div className="border-b border-border-subtle px-20 py-16">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles, topics and tags"
            aria-label="Search query"
            autoComplete="off"
            className="w-full bg-transparent font-charlie-text text-body text-ink outline-none placeholder:text-ink-muted"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {message ? (
            <p className="px-20 py-24 font-charlie-text text-ui text-ink-muted">{message}</p>
          ) : (
            <ul className="list-none py-8" role="listbox" aria-label="Search results">
              {hits.map((hit, index) => (
                <li key={hit.slug} role="option" aria-selected={index === activeIndex}>
                  <Link
                    href={`/${hit.slug}`}
                    onClick={onClose}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={
                      index === activeIndex
                        ? 'block bg-surface-soft px-20 py-12'
                        : 'block px-20 py-12'
                    }
                  >
                    <span className="flex flex-wrap items-center gap-8">
                      <span className="font-charlie-text text-body font-medium text-ink">
                        {hit.title}
                      </span>
                      {hit.category ? <Badge tone="accent">{hit.category}</Badge> : null}
                      {hit.difficulty ? <Badge>{hit.difficulty}</Badge> : null}
                    </span>
                    <span className="mt-4 block font-charlie-text text-caption text-ink-muted">
                      {hit.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle px-20 py-8">
          <span className="font-charlie-text text-caption text-ink-muted">
            ↑ ↓ to navigate · Enter to open · Esc to close
          </span>
          {hits.length > 0 ? (
            <span className="font-charlie-text text-caption text-ink-muted">
              {hits.length} result{hits.length === 1 ? '' : 's'}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
