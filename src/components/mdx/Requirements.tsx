import type { ReactNode } from 'react';

/**
 * Functional and non-functional requirements, the opening move of every system
 * design case study.
 */

interface RequirementsProps {
  functional: string[];
  nonFunctional: string[];
  /** Explicitly excluded scope — as useful to a reader as what is included. */
  outOfScope?: string[];
}

function Group({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-8 font-charlie-text text-caption font-medium tracking-wide text-ink uppercase">
        {title}
      </p>
      <ul className="m-0 list-disc pl-20">
        {items.map((item) => (
          <li key={item} className="mb-4 font-charlie-text text-body text-ink-body last:mb-0">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Requirements({ functional, nonFunctional, outOfScope }: RequirementsProps) {
  return (
    <div className="my-24 grid gap-24 rounded-cards border border-border-subtle p-24 md:grid-cols-2">
      <Group title="Functional" items={functional} />
      <Group title="Non-functional" items={nonFunctional} />
      {outOfScope && outOfScope.length > 0 ? (
        <div className="border-t border-border-subtle pt-16 md:col-span-2">
          <Group title="Out of scope" items={outOfScope} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Back-of-the-envelope numbers. Kept as label/value/working triples so the
 * arithmetic is shown rather than asserted.
 */
export interface Estimate {
  label: string;
  value: string;
  working?: string;
}

export function CapacityEstimate({
  estimates,
  children,
}: {
  estimates: Estimate[];
  children?: ReactNode;
}) {
  return (
    <div className="my-24 rounded-cards border border-border-subtle p-24">
      <dl className="m-0 grid gap-16 sm:grid-cols-2">
        {estimates.map((estimate) => (
          <div key={estimate.label}>
            <dt className="font-charlie-text text-caption text-ink-muted">{estimate.label}</dt>
            <dd className="m-0 font-charlie-display text-subheading font-medium text-ink">
              {estimate.value}
            </dd>
            {estimate.working ? (
              <p className="m-0 font-mono text-caption text-ink-muted">{estimate.working}</p>
            ) : null}
          </div>
        ))}
      </dl>
      {children ? (
        <div className="mt-16 border-t border-border-subtle pt-16 text-ink-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default Requirements;
