import type { ReactNode } from 'react';

/**
 * Numbered walkthrough for step-by-step flows — the backbone of the
 * "what happens when you…" articles.
 *
 *   <Steps>
 *     <Step title="Client requests a checkout session">
 *       The browser POSTs to your backend, never to the provider directly.
 *     </Step>
 *   </Steps>
 *
 * Numbering is a CSS counter rather than a prop, so inserting a step in the
 * middle never means renumbering the ones below it.
 */

export function Steps({ children }: { children: ReactNode }) {
  return (
    <ol className="steps my-24 list-none [counter-reset:step] [padding-left:0]">{children}</ol>
  );
}

interface StepProps {
  title: string;
  children: ReactNode;
}

export function Step({ title, children }: StepProps) {
  return (
    <li className="relative mb-24 pl-40 [counter-increment:step] last:mb-0">
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 flex h-24 w-24 items-center justify-center rounded-full bg-accent font-charlie-text text-caption font-medium text-accent-ink before:content-[counter(step)]"
      />
      <p className="mt-0 mb-4 font-charlie-display text-subheading font-medium text-ink">{title}</p>
      <div className="text-ink-body [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{children}</div>
    </li>
  );
}

export default Steps;
