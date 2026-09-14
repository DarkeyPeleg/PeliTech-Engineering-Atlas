import Link from 'next/link';
import { getSections } from '@/lib/content/source';
import { siteConfig } from '@/lib/config/site';

export async function Footer() {
  const sections = await getSections();

  return (
    <footer className="mt-80 border-t border-border-subtle">
      <div className="mx-auto max-w-page px-20 py-48">
        <div className="grid gap-32 md:grid-cols-[2fr_3fr]">
          <div>
            <p className="font-charlie-display text-subheading font-medium text-ink">
              {siteConfig.name}
            </p>
            <p className="mt-8 max-w-[42ch] font-charlie-text text-ui text-ink-muted">
              {siteConfig.tagline}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid list-none grid-cols-2 gap-x-24 gap-y-8 sm:grid-cols-3">
              {sections.map((section) => (
                <li key={section.slug}>
                  <Link
                    href={`/${section.slug}`}
                    className="font-charlie-text text-ui text-ink-muted transition-colors hover:text-accent"
                  >
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-32 flex flex-wrap items-center gap-x-20 gap-y-8 border-t border-border-subtle pt-20">
          <p className="font-charlie-text text-caption text-ink-muted">
            Open source under the {siteConfig.license} license.
          </p>
          <a
            href={siteConfig.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="font-charlie-text text-caption text-accent hover:text-ink"
          >
            Contribute on GitHub
          </a>
          <Link
            href="/styleguide"
            className="font-charlie-text text-caption text-ink-muted hover:text-accent"
          >
            Style guide
          </Link>
        </div>
      </div>
    </footer>
  );
}
