import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContentIndex, getDocBySlug } from '@/lib/content/source';
import { getBreadcrumbs, getSectionChildren, getSiblings } from '@/lib/content/tree';
import { getRelated } from '@/lib/content/related';
import { renderMdx } from '@/lib/content/mdx';
import { mdxComponents } from '@/mdx-components';
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildDocMetadata,
  buildSectionMetadata,
} from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { Sidebar } from '@/components/nav/Sidebar';
import { MobileNav } from '@/components/nav/MobileNav';
import { Breadcrumbs } from '@/components/docs/Breadcrumbs';
import { DocMeta, RelatedTopicsList } from '@/components/docs/DocMeta';
import { PrevNext } from '@/components/docs/PrevNext';
import { SectionIndex } from '@/components/docs/SectionIndex';
import { Toc } from '@/components/docs/Toc';

/**
 * Every documentation route, from one file.
 *
 * A URL resolves in one of two ways:
 *   - an article or section `index.mdx` exists  -> render it
 *   - the URL is a directory with no index      -> render a generated listing
 *
 * Anything else is a 404. `generateStaticParams` enumerates the content index, so
 * the entire site is statically generated at build time.
 */

interface RouteParams {
  params: Promise<{ slug: string[] }>;
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const { docs, dirs } = await getContentIndex();

  const routes = new Map<string, string[]>();
  for (const doc of docs) routes.set(doc.slug, doc.segments);
  // Directories without an index.mdx still need a route for their listing page.
  for (const dir of dirs) if (!routes.has(dir.slug)) routes.set(dir.slug, dir.segments);

  return [...routes.values()].map((segments) => ({ slug: segments }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const path = slug.join('/');

  const doc = await getDocBySlug(path);
  if (doc) return buildDocMetadata(doc);

  const { dirBySlug } = await getContentIndex();
  const dir = dirBySlug.get(path);
  if (!dir) return {};

  return buildSectionMetadata({
    title: dir.label,
    description: dir.description ?? `Articles in ${dir.label}.`,
    path: `/${dir.slug}`,
  });
}

export default async function DocPage({ params }: RouteParams) {
  const { slug } = await params;
  const path = slug.join('/');

  const doc = await getDocBySlug(path);
  const { dirBySlug } = await getContentIndex();
  const dir = dirBySlug.get(path);

  if (!doc && !dir) notFound();

  const [crumbs, children, siblings] = await Promise.all([
    getBreadcrumbs(path),
    dir ? getSectionChildren(path) : Promise.resolve([]),
    getSiblings(path),
  ]);

  const related = doc ? await getRelated(doc) : null;
  const title = doc?.frontmatter.title ?? dir?.label ?? '';
  const description = doc?.frontmatter.description ?? dir?.description;
  const showToc = Boolean(doc?.frontmatter.toc && doc.toc.length > 1);

  return (
    <div className="mx-auto flex max-w-page gap-40 px-20">
      {/* Sidebar: sticky, its own scroll context, below the 56px header. */}
      <aside className="hidden w-[260px] shrink-0 lg:block">
        <div className="sticky top-[56px] max-h-[calc(100vh-56px)] overflow-y-auto py-32 pr-8">
          <Sidebar />
        </div>
      </aside>

      <div className="min-w-0 flex-1 py-32">
        <div className="mb-24 lg:hidden">
          <MobileNav>
            <Sidebar />
          </MobileNav>
        </div>

        <Breadcrumbs crumbs={crumbs} />

        <article className="mt-16">
          <header>
            <h1 className="font-charlie-display text-heading-fluid font-medium tracking-display text-ink">
              {title}
            </h1>
            {description ? (
              <p className="mt-12 max-w-[68ch] font-charlie-text text-subheading text-ink-muted">
                {description}
              </p>
            ) : null}
            {doc ? <DocMeta doc={doc} /> : null}
          </header>

          {/* The table of contents sits inline above the article on narrow
              viewports, and in the right rail from xl up. */}
          {showToc && doc ? (
            <div className="mt-32 rounded-cards bg-surface-soft px-20 py-16 xl:hidden">
              <Toc entries={doc.toc} />
            </div>
          ) : null}

          <div className="flex gap-40">
            <div className="article-prose mt-32 min-w-0 flex-1">
              {doc ? await renderMdx(doc.body, mdxComponents) : null}
            </div>

            {showToc && doc ? (
              <div className="hidden w-[220px] shrink-0 xl:block">
                <div className="sticky top-[88px] max-h-[calc(100vh-120px)] overflow-y-auto py-32">
                  <Toc entries={doc.toc} />
                </div>
              </div>
            ) : null}
          </div>

          {dir ? (
            <SectionIndex nodes={children} heading={doc ? 'In this section' : undefined} />
          ) : null}

          {related && related.links.length > 0 ? (
            <RelatedTopicsList links={related.links} heading="Related concepts" />
          ) : null}
          {related && related.links.length === 0 && related.suggested.length > 0 ? (
            <RelatedTopicsList links={related.suggested} heading="Related by topic" />
          ) : null}

          <PrevNext previous={siblings.previous} next={siblings.next} />
        </article>

        {doc ? (
          <StructuredData data={[buildArticleJsonLd(doc), buildBreadcrumbJsonLd(crumbs)]} />
        ) : (
          <StructuredData data={buildBreadcrumbJsonLd(crumbs)} />
        )}
      </div>
    </div>
  );
}
