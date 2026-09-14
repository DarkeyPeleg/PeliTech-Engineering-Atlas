'use client';

import { useEffect, useState } from 'react';
import { SearchDialog } from './SearchDialog';

/**
 * The header search affordance. The dialog itself — and the search index — is
 * only mounted once opened, so nothing about search is downloaded until asked for.
 */
export function SearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (!isShortcut) return;
      event.preventDefault();
      setOpen((value) => !value);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-8 rounded-inputs border border-border-subtle bg-surface-soft px-12 py-4 font-charlie-text text-ui text-ink-muted transition-colors hover:border-border-disabled"
      >
        <span>Search</span>
        <kbd className="hidden font-mono text-caption text-ink-muted sm:inline">⌘K</kbd>
      </button>

      {open ? <SearchDialog onClose={() => setOpen(false)} /> : null}
    </>
  );
}
