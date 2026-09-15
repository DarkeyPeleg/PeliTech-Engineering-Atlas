/**
 * Single source of truth for product identity.
 *
 * Nothing else in the application hardcodes the product name, tagline or URLs —
 * the header, footer, homepage, metadata, sitemap and JSON-LD all read from here.
 * Taxonomy labels live with the content instead, in each `docs/**\/_meta.json`.
 */

const FALLBACK_URL = 'http://localhost:3000';

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || null;

function resolveSiteUrl(): string {
  if (configuredUrl) return configuredUrl;

  // Vercel sets this for preview deployments, where no canonical URL exists yet.
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`;

  return FALLBACK_URL;
}

export const siteConfig = {
  name: 'PeliTech Engineering Atlas',
  /** Used where the full name does not fit, e.g. the sticky navigation wordmark. */
  shortName: 'Engineering Atlas',
  tagline: 'Understanding how software systems are designed, built, integrated, and scaled.',
  description:
    'An open-source engineering knowledge base covering system design, software architecture, backend engineering, databases, APIs and third-party integrations — with diagrams, trade-offs, failure scenarios and practical implementation guidance.',
  url: resolveSiteUrl(),
  repoUrl: 'https://github.com/DarkeyPeleg/PeliTech-Engineering-Atlas',
  license: 'MIT',
  locale: 'en_US',
} as const;

/**
 * `true` only for the canonical production deployment, which is what allows
 * indexing in robots.ts.
 *
 * Compared against the normalised value rather than the raw environment variable:
 * setting `NEXT_PUBLIC_SITE_URL` with a trailing slash would otherwise fail this
 * check and quietly serve `Disallow: /` in production.
 */
export const isProductionSite = configuredUrl !== null && siteConfig.url === configuredUrl;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${normalized === '/' ? '' : normalized}`;
}
