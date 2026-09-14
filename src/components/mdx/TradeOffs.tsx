import type { ReactNode } from 'react';

/**
 * Side-by-side strengths and weaknesses. Every architectural choice in this
 * knowledge base is supposed to state its costs, and a shared component makes
 * that habit visible and consistent across articles.
 */

interface TradeOffsProps {
  strengths: string[];
  weaknesses: string[];
  /** Optional prose shown beneath the two columns. */
  children?: ReactNode;
  strengthsLabel?: string;
  weaknessesLabel?: string;
}

function Column({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-8 font-charlie-text text-caption font-medium tracking-wide text-ink uppercase">
        {label}
      </p>
      <ul className="m-0 list-none p-0">
        {items.map((item) => (
          <li
            key={item}
            className="mb-8 border-l border-border-disabled pl-12 font-charlie-text text-body text-ink-body last:mb-0"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TradeOffs({
  strengths,
  weaknesses,
  children,
  strengthsLabel = 'Strengths',
  weaknessesLabel = 'Weaknesses',
}: TradeOffsProps) {
  return (
    <div className="my-24 rounded-cards border border-border-subtle p-24">
      <div className="grid gap-24 sm:grid-cols-2">
        <Column label={strengthsLabel} items={strengths} />
        <Column label={weaknessesLabel} items={weaknesses} />
      </div>
      {children ? (
        <div className="mt-16 border-t border-border-subtle pt-16 text-ink-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default TradeOffs;
