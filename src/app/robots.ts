import type { MetadataRoute } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/config/site';

export default function robots(): MetadataRoute.Robots {
  // Preview deployments should never be indexed in place of the canonical site.
  const isCanonical = siteConfig.url === process.env.NEXT_PUBLIC_SITE_URL;

  if (!isCanonical) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // An internal token reference, not article content.
      disallow: '/styleguide',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteConfig.url,
  };
}
