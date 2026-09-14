import Link from 'next/link';
import { getAllDocs, getSections } from '@/lib/content/source';
import { getNavTree } from '@/lib/content/tree';
import { siteConfig } from '@/lib/config/site';
import { ButtonLink } from '@/components/ui/Button';
import { ConfettiFrame } from '@/components/decor/ConfettiFrame';
import { Badge } from '@/components/ui/Badge';

/**
 * Homepage, in the editorial register from design.md: a full-bleed dark hero
 * framed by confetti, then alternating white and lavender bands.
 *
 * Every list on this page is derived from the content tree, so it stays accurate
 * as articles are added and never needs editing to reflect new sections.
 */

export default async function HomePage() {
  const [sections, tree, docs] = await Promise.all([getSections(), getNavTree(), getAllDocs()]);

  const articleCount = docs.filter((doc) => !doc.isSectionIndex).length;
  const topicCount = tree.reduce(
    (total, section) => total + section.children.filter((child) => child.type === 'section').length,
    0,
  );

  // A small "start here" set: the shallowest, most foundational articles.
  const starters = docs
    .filter((doc) => !doc.isSectionIndex && doc.frontmatter.difficulty === 'Beginner')
    .slice(0, 3);

  return (
    <>
      {/* Hero — Dark Panel, full bleed, confetti framed. */}
      <section className="relative isolate overflow-hidden bg-surface-inverted">
        <ConfettiFrame />
        <div className="relative mx-auto max-w-page px-20 py-80 lg:py-100">
          <div className="max-w-[46ch]">
            <p className="font-charlie-text text-ui font-medium text-accent-on-dark">
              Open-source engineering knowledge base
            </p>
            <h1 className="mt-16 font-charlie-display text-display-fluid font-medium tracking-display text-ink-inverted">
              {siteConfig.name}
            </h1>
            <p className="mt-24 font-charlie-text text-subheading text-ink-inverted/80">
              {siteConfig.tagline}
            </p>
            <div className="mt-32 flex flex-wrap items-center gap-16">
              <ButtonLink href="/system-design" variant="onDark">
                Start with system design
              </ButtonLink>
              <a
                href={siteConfig.repoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="font-charlie-text text-body font-medium text-ink-inverted underline-offset-4 hover:underline"
              >
                Contribute an article
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What this is — white canvas. */}
      <section className="mx-auto max-w-page px-20 py-64">
        <div className="grid gap-40 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="font-charlie-display text-heading-fluid font-medium tracking-display text-ink">
              Engineering explained properly, not summarised
            </h2>
          </div>
          <div className="font-charlie-text text-body text-ink-body">
            <p>
              Most material on system design either stops at definitions or jumps straight to
              interview answers. This knowledge base sits in between: each article explains the
              problem a technique exists to solve, how it actually works, what it costs, and how it
              fails.
            </p>
            <p className="mt-16">
              Articles carry architecture and sequence diagrams, worked code where it clarifies
              something, explicit trade-offs, failure scenarios, and security and scalability
              considerations. Everything lives as MDX in a public repository, so corrections are a
              pull request away.
            </p>
            <div className="mt-24 flex flex-wrap items-center gap-8">
              <Badge tone="accent">{articleCount} articles</Badge>
              <Badge>{sections.length} knowledge areas</Badge>
              <Badge>{topicCount} topics</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Knowledge areas — cards, generated from the content tree. */}
      <section className="mx-auto max-w-page px-20 pb-64">
        <h2 className="font-charlie-display text-heading font-medium tracking-display text-ink">
          Browse by area
        </h2>
        <ul className="mt-24 grid list-none gap-16 md:grid-cols-2 lg:grid-cols-3">
          {tree.map((section) => {
            const topics = section.children.filter((child) => child.type === 'section');
            return (
              <li key={section.slug}>
                <Link
                  href={section.href ?? `/${section.slug}`}
                  className="group flex h-full flex-col rounded-cards border border-border-subtle p-24 transition-colors hover:border-accent"
                >
                  <span className="font-charlie-display text-subheading font-medium text-ink group-hover:text-accent">
                    {section.label}
                  </span>
                  {section.description ? (
                    <span className="mt-8 flex-1 font-charlie-text text-ui text-ink-muted">
                      {section.description}
                    </span>
                  ) : (
                    <span className="flex-1" />
                  )}
                  {topics.length > 0 ? (
                    <span className="mt-16 font-charlie-text text-caption text-ink-muted">
                      {topics
                        .slice(0, 4)
                        .map((topic) => topic.label)
                        .join(' · ')}
                      {topics.length > 4 ? ' · …' : ''}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Lavender feature band — editorial divider, text directly on the surface. */}
      <section className="bg-surface-band">
        <div className="mx-auto max-w-page px-20 py-64 text-center">
          <h2 className="mx-auto max-w-[24ch] font-charlie-display text-heading font-medium tracking-display text-ink">
            Written to be argued with
          </h2>
          <p className="mx-auto mt-16 max-w-[60ch] font-charlie-text text-body text-ink">
            Every article states its trade-offs and the conditions under which its advice stops
            applying. If something here is wrong, incomplete, or has aged badly, the fix is a pull
            request against a Markdown file.
          </p>
          <div className="mt-32">
            <ButtonLink href={`${siteConfig.repoUrl}/blob/main/CONTRIBUTING.md`}>
              Read the contribution guide
            </ButtonLink>
          </div>
        </div>
      </section>

      {starters.length > 0 ? (
        <section className="mx-auto max-w-page px-20 py-64">
          <h2 className="font-charlie-display text-heading font-medium tracking-display text-ink">
            Start here
          </h2>
          <ul className="mt-24 grid list-none gap-16 md:grid-cols-3">
            {starters.map((doc) => (
              <li key={doc.slug}>
                <Link
                  href={doc.href}
                  className="group flex h-full flex-col rounded-cards border border-border-subtle p-24 transition-colors hover:border-accent"
                >
                  <span className="font-charlie-text text-caption text-ink-muted">
                    {doc.category}
                  </span>
                  <span className="mt-8 font-charlie-display text-subheading font-medium text-ink group-hover:text-accent">
                    {doc.frontmatter.title}
                  </span>
                  <span className="mt-8 flex-1 font-charlie-text text-ui text-ink-muted">
                    {doc.frontmatter.description}
                  </span>
                  <span className="mt-16 font-charlie-text text-caption text-ink-muted">
                    {doc.readingTime} min read
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
