import type { MetadataRoute } from 'next';
import { absoluteUrl, isProductionSite, siteConfig } from '@/lib/config/site';

export default function robots(): MetadataRoute.Robots {
  // Preview deployments should never be indexed in place of the canonical site.
  if (!isProductionSite) {
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
