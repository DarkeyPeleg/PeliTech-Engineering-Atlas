import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import type { DocEntry } from '@/lib/content/source';
import { siteConfig } from '@/lib/config/site';

/**
 * The metadata strip under an article title: difficulty, reading time, last
 * updated, tags, and a link to edit the file on GitHub.
 *
 * Every field is optional in frontmatter, so each one renders only when present
 * rather than showing empty labels.
 */

function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function DocMeta({ doc }: { doc: DocEntry }) {
  const { difficulty, lastUpdated, tags } = doc.frontmatter;
  const editUrl = `${siteConfig.repoUrl}/edit/main/docs/${doc.relativePath}`;

  return (
    <div className="mt-16 flex flex-wrap items-center gap-x-16 gap-y-8">
      {difficulty ? <Badge tone="accent">{difficulty}</Badge> : null}

      <span className="font-charlie-text text-caption text-ink-muted">
        {doc.readingTime} min read
      </span>

      {lastUpdated ? (
        <span className="font-charlie-text text-caption text-ink-muted">
          Updated <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
        </span>
      ) : null}

      {tags.length > 0 ? (
        <span className="flex flex-wrap items-center gap-8">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </span>
      ) : null}

      <a
        href={editUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="font-charlie-text text-caption text-accent transition-colors hover:text-ink"
      >
        Edit this page
      </a>
    </div>
  );
}

/** Compact variant for cards in section listings. */
export function DocMetaInline({
  difficulty,
  readingTime,
}: {
  difficulty?: string | undefined;
  readingTime?: number | undefined;
}) {
  if (!difficulty && !readingTime) return null;

  return (
    <span className="flex items-center gap-8">
      {difficulty ? <Badge>{difficulty}</Badge> : null}
      {readingTime ? (
        <span className="font-charlie-text text-caption text-ink-muted">{readingTime} min</span>
      ) : null}
    </span>
  );
}

export function RelatedTopicsList({
  links,
  heading,
}: {
  links: { slug: string; href: string; title: string; description: string }[];
  heading: string;
}) {
  if (links.length === 0) return null;

  return (
    <section aria-labelledby="related-topics" className="mt-48 border-t border-border-subtle pt-24">
      <h2 id="related-topics" className="font-charlie-display text-heading-sm font-medium text-ink">
        {heading}
      </h2>
      <ul className="mt-16 grid list-none gap-12 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.slug}>
            <Link
              href={link.href}
              className="group block rounded-cards border border-border-subtle p-16 transition-colors hover:border-accent"
            >
              <span className="block font-charlie-text text-body font-medium text-ink group-hover:text-accent">
                {link.title}
              </span>
              <span className="mt-4 block font-charlie-text text-caption text-ink-muted">
                {link.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
