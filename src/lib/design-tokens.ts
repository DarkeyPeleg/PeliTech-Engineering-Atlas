/**
 * The brand palette as literal values, mirroring the `--brand-*` tokens in
 * src/app/theme.css.
 *
 * CSS is the source of truth and components must use the semantic aliases. This
 * file exists for the few consumers that cannot read a CSS variable at all:
 *
 *   - `<meta name="theme-color">`, which browsers parse as a literal colour
 *   - Mermaid, which is configured in JavaScript and resolves no custom properties
 *
 * It is the only module outside theme.css allowed to contain colour literals, and
 * scripts/validate-content.ts enforces that. If you change a value here, change
 * it in theme.css too.
 */

export const brandColors = {
  atlassianBlue: '#1868db',
  midnightNavy: '#101214',
  carbonEdge: '#292a2e',
  slateCurrent: '#1c2b42',
  mutedIndigo: '#42526e',
  pureWhite: '#ffffff',
  fogWhite: '#f0f1f2',
  ashGray: '#b7b9be',
  taxicabYellow: '#fca700',
  lavenderWash: '#eed7fc',
  tintedBlue: '#e9f2fe',

  /** Decorative palette — editorial framing and diagrams only. */
  confettiViolet: '#bf63f3',
  confettiYellow: '#fca700',
  confettiBlue: '#4d8ced',
  confettiGreen: '#22a06b',

  /** Soft decorative tints, used as diagram node fills. */
  queueTint: '#fff4de',
  cacheTint: '#e3f5ec',
} as const;
