import type { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Callout, CommonMistake, Note, ScalabilityNote, SecurityNote, Tip, Warning } from '@/components/mdx/Callout';
import { Steps, Step } from '@/components/mdx/Steps';
import { TradeOffs } from '@/components/mdx/TradeOffs';
import { ComparisonTable } from '@/components/mdx/ComparisonTable';
import { FailureScenarios } from '@/components/mdx/FailureScenarios';
import { Requirements, CapacityEstimate } from '@/components/mdx/Requirements';
import { KeyTakeaways } from '@/components/mdx/KeyTakeaways';
import { ConfettiFrame } from '@/components/decor/ConfettiFrame';

/**
 * Living reference for the design system, rendering every token and primitive on
 * one page.
 *
 * It exists so token drift is visible, and so the tightest contrast pairings in
 * design.md (muted text on the lavender band, for instance) can be checked by eye
 * rather than argued about. Excluded from the sitemap and disallowed in robots.txt.
 */

export const metadata: Metadata = {
  title: 'Style guide',
  description: 'Design tokens and component primitives used across the knowledge base.',
  robots: { index: false, follow: false },
};

const colorTokens = [
  ['--color-ink', 'Primary text, headings'],
  ['--color-ink-body', 'Body copy'],
  ['--color-ink-muted', 'Metadata, helper text'],
  ['--color-ink-subtle', 'Tertiary text, icon strokes'],
  ['--color-accent', 'Every action and link'],
  ['--color-accent-soft', 'Brand-tinted surface'],
  ['--color-accent-on-dark', 'Yellow CTA — dark panels only'],
  ['--color-surface', 'Canvas'],
  ['--color-surface-soft', 'Soft surface'],
  ['--color-surface-tinted', 'Tinted surface'],
  ['--color-surface-band', 'Lavender band'],
  ['--color-surface-inverted', 'Dark panel'],
  ['--color-border-subtle', 'Hairlines'],
  ['--color-border-strong', 'Emphasised borders'],
  ['--color-border-disabled', 'Disabled, separators'],
] as const;

const decorTokens = [
  ['--color-decor-violet', 'Confetti / datastore'],
  ['--color-decor-yellow', 'Confetti / queue'],
  ['--color-decor-blue', 'Confetti / service'],
  ['--color-decor-green', 'Confetti / cache'],
] as const;

const typeScale = [
  ['display', 'text-display', '80px / 1.0'],
  ['heading-lg', 'text-heading-lg', '48px / 1.14'],
  ['heading', 'text-heading', '32px / 1.2'],
  ['heading-sm', 'text-heading-sm', '24px / 1.25'],
  ['subheading', 'text-subheading', '20px / 1.4'],
  ['body', 'text-body', '16px / 1.5'],
  ['ui', 'text-ui', '14px / 1.25'],
  ['caption', 'text-caption', '13px / 1.29'],
] as const;

const radii = [
  ['nav', 'rounded-nav', '2px'],
  ['images', 'rounded-images', '5px'],
  ['inputs', 'rounded-inputs', '8px'],
  ['cards', 'rounded-cards', '20px'],
  ['buttons', 'rounded-buttons', '28px'],
  ['full', 'rounded-full', '10000px'],
] as const;

const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border-subtle py-40">
      <h2 className="mb-24 font-charlie-display text-heading font-medium tracking-display text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-page px-20 py-48">
      <header>
        <p className="font-charlie-text text-ui font-medium text-accent">Internal reference</p>
        <h1 className="mt-8 font-charlie-display text-heading-fluid font-medium tracking-display text-ink">
          Design system
        </h1>
        <p className="mt-16 max-w-[64ch] font-charlie-text text-body text-ink-muted">
          Every token and primitive defined by design.md. Components consume the semantic aliases
          below, never raw hex values — Tailwind&rsquo;s default palette and scales are cleared in
          theme.css, so anything outside this set does not compile.
        </p>
      </header>

      <Section title="Semantic colors">
        <ul className="grid list-none gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map(([token, role]) => (
            <li key={token} className="flex items-center gap-12">
              <span
                className="h-40 w-40 shrink-0 rounded-images border border-border-subtle"
                style={{ background: `var(${token})` }}
              />
              <span>
                <code className="block font-mono text-caption text-ink">{token}</code>
                <span className="font-charlie-text text-caption text-ink-muted">{role}</span>
              </span>
            </li>
          ))}
        </ul>

        <h3 className="mt-32 mb-12 font-charlie-display text-heading-sm font-medium text-ink">
          Decorative palette
        </h3>
        <p className="mb-16 max-w-[64ch] font-charlie-text text-ui text-ink-muted">
          Editorial framing and Mermaid diagrams only. design.md forbids these in functional UI —
          never on a button, link or form control.
        </p>
        <ul className="grid list-none gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {decorTokens.map(([token, role]) => (
            <li key={token} className="flex items-center gap-12">
              <span
                className="h-40 w-40 shrink-0 rounded-images"
                style={{ background: `var(${token})` }}
              />
              <span>
                <code className="block font-mono text-caption text-ink">{token}</code>
                <span className="font-charlie-text text-caption text-ink-muted">{role}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Surfaces and contrast pairs">
        <div className="grid gap-16 md:grid-cols-2">
          <div className="rounded-cards bg-surface p-24 ring-1 ring-border-subtle">
            <p className="font-charlie-display text-subheading font-medium text-ink">Canvas</p>
            <p className="mt-8 font-charlie-text text-body text-ink-body">Body copy on canvas.</p>
            <p className="mt-4 font-charlie-text text-caption text-ink-muted">Muted metadata.</p>
          </div>
          <div className="rounded-cards bg-surface-soft p-24">
            <p className="font-charlie-display text-subheading font-medium text-ink">Soft surface</p>
            <p className="mt-8 font-charlie-text text-body text-ink-body">Body copy on fog white.</p>
            <p className="mt-4 font-charlie-text text-caption text-ink-muted">Muted metadata.</p>
          </div>
          <div className="rounded-cards bg-surface-tinted p-24">
            <p className="font-charlie-display text-subheading font-medium text-ink">
              Tinted surface
            </p>
            <p className="mt-8 font-charlie-text text-body text-ink-body">Body copy on blue tint.</p>
            <p className="mt-4 font-charlie-text text-caption text-accent">Accent text.</p>
          </div>
          <div className="rounded-cards bg-surface-band p-24">
            <p className="font-charlie-display text-subheading font-medium text-ink">
              Lavender band
            </p>
            <p className="mt-8 font-charlie-text text-body text-ink">
              Dark ink only on lavender, per design.md.
            </p>
          </div>
          <div className="rounded-cards bg-surface-inverted p-24 md:col-span-2">
            <p className="font-charlie-display text-subheading font-medium text-ink-inverted">
              Dark panel
            </p>
            <p className="mt-8 font-charlie-text text-body text-ink-inverted/80">
              White on navy is the only inverted pair.
            </p>
            <p className="mt-8 font-charlie-text text-body font-medium text-accent-on-dark">
              Yellow appears here and nowhere else.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Typography">
        <ul className="list-none">
          {typeScale.map(([name, className, spec]) => (
            <li
              key={name}
              className="flex flex-wrap items-baseline gap-x-16 border-b border-border-subtle py-12"
            >
              <span className={`${className} font-charlie-display font-medium text-ink`}>
                {name}
              </span>
              <code className="font-mono text-caption text-ink-muted">{className}</code>
              <span className="font-charlie-text text-caption text-ink-muted">{spec}</span>
            </li>
          ))}
        </ul>
        <p className="mt-24 font-charlie-text text-body text-ink-body">
          Charlie Display is substituted by Manrope and Charlie Text by Inter, as design.md
          specifies. This paragraph is Charlie Text at body size.
        </p>
      </Section>

      <Section title="Radii and spacing">
        <ul className="flex list-none flex-wrap gap-16">
          {radii.map(([name, className, value]) => (
            <li key={name} className="text-center">
              <span
                className={`block h-64 w-64 border border-border-strong bg-surface-soft ${className}`}
              />
              <code className="mt-8 block font-mono text-caption text-ink">{className}</code>
              <span className="font-charlie-text text-caption text-ink-muted">{value}</span>
            </li>
          ))}
        </ul>

        <p className="mt-32 mb-12 font-charlie-text text-ui text-ink-muted">
          Spacing utilities are px-valued: <code className="font-mono">p-4</code> is 4px, not
          Tailwind&rsquo;s default 16px.
        </p>
        <ul className="flex list-none flex-wrap items-end gap-8">
          {spacing.map((step) => (
            <li key={step} className="text-center">
              <span
                className="block bg-accent"
                style={{ width: `var(--spacing-${step})`, height: `var(--spacing-${step})` }}
              />
              <code className="mt-4 block font-mono text-caption text-ink-muted">{step}</code>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Actions">
        <div className="flex flex-wrap items-center gap-16">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
          <ButtonLink href="/" size="sm">
            Small link
          </ButtonLink>
        </div>
        <div className="mt-16 rounded-cards bg-surface-inverted p-24">
          <Button variant="onDark">Yellow CTA on dark</Button>
        </div>
        <div className="mt-24 flex flex-wrap items-center gap-8">
          <Badge>Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge>Beginner</Badge>
        </div>
      </Section>

      <Section title="Elevation and decoration">
        <div className="grid gap-16 md:grid-cols-2">
          <Card>
            <p className="font-charlie-text text-body text-ink-body">
              Card: 20px radius, 24px padding, hairline border, no drop shadow.
            </p>
          </Card>
          <div className="rounded-cards bg-surface p-24 shadow-subtle">
            <p className="font-charlie-text text-body text-ink-body">
              The navy-tinted micro-shadow, used only where elevation is unavoidable.
            </p>
          </div>
        </div>

        <div className="relative mt-24 isolate overflow-hidden rounded-cards bg-surface-inverted">
          <ConfettiFrame hideOnSmall={false} />
          <div className="relative px-32 py-48">
            <p className="font-charlie-display text-heading-sm font-medium text-ink-inverted">
              Confetti frame
            </p>
            <p className="mt-8 max-w-[48ch] font-charlie-text text-ui text-ink-inverted/70">
              CSS clip-path fragments, no image assets. Frames dark panels only, never tiled, never
              inside white content sections.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Content primitives">
        <div className="article-prose">
          <Note>A plain note, for context a reader can skip.</Note>
          <Tip>Practical guidance drawn from real implementations.</Tip>
          <Warning>Something that will bite you if ignored.</Warning>
          <SecurityNote>A security consideration specific to this technique.</SecurityNote>
          <ScalabilityNote>What changes about this design under load.</ScalabilityNote>
          <CommonMistake>The mistake most teams make on the first attempt.</CommonMistake>
          <Callout label="Custom label">Callout with an arbitrary label.</Callout>

          <KeyTakeaways
            points={[
              'Callouts are distinguished by label and surface, not colour.',
              'design.md reserves colour for actions and decoration.',
            ]}
          />

          <Steps>
            <Step title="First step">
              Steps are numbered by a CSS counter, so inserting one never means renumbering.
            </Step>
            <Step title="Second step">Each step holds full markdown content.</Step>
          </Steps>

          <TradeOffs
            strengths={['Explicit about costs', 'Consistent across articles']}
            weaknesses={['Requires the author to actually think', 'Not suitable for short notes']}
          />

          <ComparisonTable
            options={['Option A', 'Option B']}
            rows={[
              { aspect: 'Operational cost', values: ['Low', 'Higher'] },
              { aspect: 'Failure blast radius', values: ['Whole system', 'One service'] },
            ]}
            caption="Comparison tables are components, so the shape is type-checked."
          />

          <FailureScenarios
            scenarios={[
              {
                failure: 'Downstream provider times out',
                impact: 'Request hangs, user retries',
                mitigation: 'Bounded timeout, idempotency key, retry with backoff',
              },
            ]}
          />

          <Requirements
            functional={['A rider can request a trip', 'A driver can accept a trip']}
            nonFunctional={['p99 matching under 5s', '99.9% availability']}
            outOfScope={['Fare disputes', 'Multi-city routing']}
          />

          <CapacityEstimate
            estimates={[
              { label: 'Daily trips', value: '2M', working: '10M users x 0.2 trips/day' },
              { label: 'Peak writes', value: '~700/s', working: '2M / 86400 x 30 peak factor' },
            ]}
          />
        </div>
      </Section>
    </div>
  );
}
