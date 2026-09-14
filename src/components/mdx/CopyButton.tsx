'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * The only client-side JavaScript a code block needs — highlighting itself
 * happens at build time.
 */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard access can be denied; leaving the label unchanged is a
      // truthful outcome, and the code remains selectable by hand.
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={() => void copy()}
      // aria-live announces the result without moving focus.
      aria-live="polite"
      className="rounded-full px-8 py-4 font-charlie-text text-caption font-medium text-ink-inverted/70 transition-colors hover:bg-ink-inverted/10 hover:text-ink-inverted"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default CopyButton;
