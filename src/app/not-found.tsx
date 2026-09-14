import { getSections } from '@/lib/content/source';
import { ButtonLink } from '@/components/ui/Button';
import Link from 'next/link';

export default async function NotFound() {
  const sections = await getSections();

  return (
    <div className="mx-auto max-w-page px-20 py-80">
      <p className="font-charlie-text text-ui font-medium text-accent">404</p>
      <h1 className="mt-8 font-charlie-display text-heading-fluid font-medium tracking-display text-ink">
        That page does not exist
      </h1>
      <p className="mt-16 max-w-[56ch] font-charlie-text text-body text-ink-muted">
        The article may have been renamed or moved. Try a knowledge area below, or search from the
        header.
      </p>

      <div className="mt-32">
        <ButtonLink href="/">Back to the homepage</ButtonLink>
      </div>

      <ul className="mt-40 grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <li key={section.slug}>
            <Link
              href={`/${section.slug}`}
              className="font-charlie-text text-body text-accent hover:text-ink"
            >
              {section.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
