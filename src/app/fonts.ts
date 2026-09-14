import { Inter, Manrope } from 'next/font/google';

/**
 * design.md specifies Charlie Display / Charlie Text, which are licensed to
 * Atlassian. It names Manrope and Inter as the substitutes, which is what we
 * self-host here. The CSS variables keep the design-system names, so dropping in
 * the real faces later means editing this file only.
 */

export const displayFont = Manrope({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700', '800'],
  variable: '--font-manrope',
});

export const textFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-inter',
});

export const fontVariables = `${displayFont.variable} ${textFont.variable}`;
