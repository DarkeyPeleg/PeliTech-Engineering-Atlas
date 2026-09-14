import type { MetadataRoute } from 'next';
import { getContentIndex } from '@/lib/content/source';
import { absoluteUrl } from '@/lib/config/site';

/**
 * Generated from the content index, so a new article is in the sitemap the moment
 * it is committed. Drafts are excluded because the content layer already filters
 * them out of production builds.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { docs, dirs } = await getContentIndex();

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  const seen = new Set<string>();

  for (const doc of docs) {
    seen.add(doc.slug);
    entries.push({
      url: absoluteUrl(doc.href),
      ...(doc.frontmatter.lastUpdated
        ? { lastModified: new Date(`${doc.frontmatter.lastUpdated}T00:00:00Z`) }
        : {}),
      changeFrequency: 'monthly',
      // Section introductions outrank individual articles.
      priority: doc.isSectionIndex ? 0.8 : 0.6,
    });
  }

  // Directories that render a generated listing rather than an index.mdx.
  for (const dir of dirs) {
    if (seen.has(dir.slug)) continue;
    entries.push({
      url: absoluteUrl(`/${dir.slug}`),
      changeFrequency: 'monthly',
      priority: 0.4,
    });
  }

  return entries;
}
