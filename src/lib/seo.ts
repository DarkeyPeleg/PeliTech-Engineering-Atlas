import type { Metadata } from 'next';
import { absoluteUrl, siteConfig } from './config/site';
import type { DocEntry } from './content/source';
import type { Breadcrumb } from './content/tree';

/**
 * Page metadata, derived from frontmatter. Every documentation page gets a real
 * title, description, canonical URL and Open Graph tags without the author doing
 * anything beyond filling in frontmatter.
 */

export function buildDocMetadata(doc: DocEntry): Metadata {
  const { title, description, tags, lastUpdated } = doc.frontmatter;
  const url = absoluteUrl(doc.href);

  return {
    title,
    description,
    keywords: tags.length > 0 ? tags : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(lastUpdated ? { modifiedTime: new Date(lastUpdated).toISOString() } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function buildSectionMetadata(options: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(options.path);

  return {
    title: options.title,
    description: options.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: options.title,
      description: options.description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
  };
}

/* ---------------------------------------------------------------------------
 * Structured data
 * ------------------------------------------------------------------------ */

export interface JsonLd {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

/**
 * `TechArticle` rather than `Article` — it is the schema.org type for technical
 * documentation, and it carries `proficiencyLevel`, which maps onto our
 * difficulty frontmatter.
 */
export function buildArticleJsonLd(doc: DocEntry): JsonLd {
  const { title, description, difficulty, lastUpdated, tags } = doc.frontmatter;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url: absoluteUrl(doc.href),
    inLanguage: 'en',
    articleSection: doc.category,
    ...(difficulty ? { proficiencyLevel: difficulty } : {}),
    ...(tags.length > 0 ? { keywords: tags.join(', ') } : {}),
    ...(lastUpdated ? { dateModified: lastUpdated } : {}),
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    license: `${siteConfig.repoUrl}/blob/main/LICENSE`,
  };
}

export function buildBreadcrumbJsonLd(crumbs: Breadcrumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      ...crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: crumb.label,
        item: absoluteUrl(crumb.href),
      })),
    ],
  };
}

export function buildWebsiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: siteConfig.url,
    inLanguage: 'en',
  };
}
