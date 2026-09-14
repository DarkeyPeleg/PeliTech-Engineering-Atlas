'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Wraps the server-rendered sidebar in a disclosure for small screens. The tree
 * is passed in as children so the mobile shell never duplicates navigation data.
 */
export function MobileNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /*
   * The panel records the route it was opened on rather than a boolean, which
   * makes "navigating dismisses the panel" fall out of the render: tapping a link
   * changes the pathname, so `open` is false on the next render with no effect
   * synchronising the two.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  // Prevent the page behind the panel from scrolling.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenedOn(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpenedOn(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        className="rounded-full border border-border-subtle px-16 py-8 font-charlie-text text-ui font-medium text-ink"
      >
        {open ? 'Close' : 'Browse topics'}
      </button>

      {open ? (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-[57px] bottom-0 z-40 overflow-y-auto border-t border-border-subtle bg-surface px-20 py-24"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
