import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Content is compiled inside the catch-all route (see src/lib/content/mdx.ts),
  // so no MDX loader is registered here and only real routes are page files.
  pageExtensions: ['ts', 'tsx'],
};

export default nextConfig;
