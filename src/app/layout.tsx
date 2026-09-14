import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/lib/config/site';
import { brandColors } from '@/lib/design-tokens';
import { buildWebsiteJsonLd } from '@/lib/seo';
import { StructuredData } from '@/components/StructuredData';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/nav/Footer';
import { fontVariables } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Canvas white, so mobile browser chrome matches the page. A meta tag needs a
  // literal value, which is why this comes from lib/design-tokens.
  themeColor: brandColors.pureWhite,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-screen bg-surface antialiased">
        <StructuredData data={buildWebsiteJsonLd()} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-8 focus:left-8 focus:z-50 focus:rounded-full focus:bg-accent focus:px-16 focus:py-8 focus:font-charlie-text focus:text-ui focus:text-accent-ink"
        >
          Skip to content
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
