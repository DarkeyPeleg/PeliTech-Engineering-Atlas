import Link from 'next/link';
import { getSections } from '@/lib/content/source';
import { siteConfig } from '@/lib/config/site';
import { SearchTrigger } from '@/components/search/SearchTrigger';
import { Wordmark } from './Wordmark';

/**
 * Sticky top bar, per design.md: 56px tall, white, single hairline bottom border,
 * 14px navigation labels. Top-level links come from the content tree, so adding a
 * knowledge area is a matter of creating a directory in `docs/`.
 */
export async function Header() {
  const sections = await getSections();

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface">
      <div className="mx-auto flex h-[56px] max-w-page items-center gap-24 px-20">
        <Link href="/" className="flex shrink-0 items-center gap-8">
          <Wordmark />
          <span className="font-charlie-display text-ui font-medium text-ink">
            {siteConfig.shortName}
          </span>
        </Link>

        <nav aria-label="Knowledge areas" className="hidden flex-1 lg:block">
          <ul className="flex list-none items-center gap-20">
            {sections.map((section) => (
              <li key={section.slug}>
                <Link
                  href={`/${section.slug}`}
                  className="font-charlie-text text-ui text-ink transition-colors hover:text-accent"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-16">
          <SearchTrigger />
          <a
            href={siteConfig.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden font-charlie-text text-ui text-accent transition-colors hover:text-ink sm:block"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
