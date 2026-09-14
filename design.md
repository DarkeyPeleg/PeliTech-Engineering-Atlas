# Design System — Style Reference

> Confetti-edged engineering blueprint. A clean white enterprise canvas interrupted by dark navy editorial panels framed in torn geometric color — vivid violet, taxicab yellow, electric blue, leaf green — like precise diagrams pinned between paint-splattered dividers.

**Theme:** light

This is the styling contract for PeliTech Engineering Atlas. Everything visual in the
application derives from the tokens below, encoded once in
[`src/app/theme.css`](src/app/theme.css). Components consume the semantic aliases defined
there, never raw hex values. See [CONTRIBUTING.md](CONTRIBUTING.md) for the rules that keep
this contract intact, and `/styleguide` in a running dev server for a live rendering of
every token and primitive.

The reference describes a marketing site, so it is applied here in **two registers**:

- **Editorial register** — homepage, section landing pages, 404. Full-bleed `#101214` panels,
  the confetti frame, `#eed7fc` lavender bands, display type up to 80px.
- **Functional register** — every article page. White canvas, 16px/1.5 body, `#1868db` for
  every link and action, `#42526e` metadata, `#f0f1f2` hairlines. No confetti, no lavender,
  no yellow.

The system operates as an enterprise workshop dressed in casual confidence: a white canvas where dense product interfaces meet bold, colorful editorial moments. The visual system splits between quiet functional surfaces (white, light gray, subtle blue) and expressive dark hero blocks (near-black navies) framed by fragmented geometric confetti in vivid violet, yellow, blue, and green. Typography is a paired sans family — Charlie Text for dense UI, Charlie Display for editorial headlines that grow to 80px with tightened tracking. Components are large, rounded, and borderless — pills for actions, generous 20px radii for cards, almost no shadow. Color is disciplined: one electric blue drives every primary action and link, while chromatic energy lives only in decorative edges and section dividers, never bleeding into functional UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Atlassian Blue | `#1868db` | `--color-atlassian-blue` | Primary action buttons, active links, focus states, icon accents — the single chromatic action color across the entire system, providing directional clarity against monochrome surfaces |
| Midnight Navy | `#101214` | `--color-midnight-navy` | Primary text, heading fills on light surfaces, dark hero panel backgrounds, link text — the dominant ink color |
| Carbon Edge | `#292a2e` | `--color-carbon-edge` | Card borders on light surfaces, body text, input borders, secondary heading text |
| Slate Current | `#1c2b42` | `--color-slate-current` | Outlined action borders, icon strokes, list dividers, tertiary text — a blue-tinted near-gray that hints at brand without committing to color |
| Muted Indigo | `#42526e` | `--color-muted-indigo` | Helper text, form labels, info badges, icon tints, secondary metadata |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on dark fills, dark-section backgrounds where contrast demands it |
| Fog White | `#f0f1f2` | `--color-fog-white` | Muted button backgrounds, secondary surface fills, hairline section dividers |
| Ash Gray | `#b7b9be` | `--color-ash-gray` | Disabled borders, subtle list separators, card shadow tints |
| Taxicab Yellow | `#fca700` | `--color-taxicab-yellow` | Sporadic CTA alternative (event registration), decorative fill in geometric confetti, accent punctuation in dark banners |
| Lavender Wash | `#eed7fc` | `--color-lavender-wash` | Soft purple section backgrounds, highlight bands, decorative geometric fills |
| Confetti Gradient | `conic-gradient(rgb(191, 99, 243) 170deg, rgb(252, 167, 0) 171deg, rgb(252, 167, 0) 230deg, rgb(77, 140, 237) 231deg, rgb(77, 140, 237) 360deg)` | `--color-confetti-gradient` | Decorative geometric borders around video and hero blocks — conic gradient sweeps violet → yellow → blue |

## Tokens — Typography

### Charlie Display — Editorial headlines, hero text, section titles

Scales from 24px sub-headings to 80px display. Weight 400-500 creates a humanist warmth uncommon in enterprise tools; letter-spacing tightens to 0.012em at large sizes for optical correction. · `--font-charlie-display`

- **Substitute:** Manrope
- **Weights:** 400, 500, 700, 800
- **Sizes:** 14, 24, 28, 32, 40, 44, 48, 70, 80
- **Line height:** 1.00, 1.10, 1.14, 1.17, 1.19, 1.20, 1.25, 1.43
- **Letter spacing:** 0.0120em at 40px+; 0.0300em at small display sizes

### Charlie Text — Body copy, UI labels, navigation, button text

Weight 400 for body, 500 for emphasized labels, 700 reserved for inline strong elements. Tight line-heights (1.20-1.25) at UI sizes maximize information density without feeling cramped. · `--font-charlie-text`

- **Substitute:** Inter
- **Weights:** 400, 500, 700
- **Sizes:** 13, 14, 16, 20, 24
- **Line height:** 1.20, 1.25, 1.29, 1.40, 1.50

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.29 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.25 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| heading-lg | 48px | 1.14 | — | `--text-heading-lg` |
| display | 80px | 1 | 0.012em | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px · **Density:** comfortable

Spacing scale: 4, 8, 12, 16, 20, 24, 32, 36, 40, 48, 60, 64, 68, 80, 100, 200 (px), as
`--spacing-4` … `--spacing-200`.

### Border Radius

| Element | Value |
|---------|-------|
| nav | 2px |
| tags | 10000px |
| cards | 20px |
| images | 5px |
| inputs | 8px |
| buttons | 28px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(9, 30, 66, 0.31) 0px 0px 1px 0px, rgba(9, 30, 66, 0.25) 0px 1px 1px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64–80px
- **Card padding:** 24px
- **Element gap:** 8–16px

## Components

### Primary Action Button
High-emphasis CTA. Filled `#1868db` background, `#ffffff` text in Charlie Text 16px weight 500. Pill radius of 28px (or 10000px for full pill). Padding 10px 22px. No border. Sits flat with zero shadow — the color does the work.

### Secondary Action Button
Tertiary CTA. Transparent background, `#101214` or `#ffffff` text (inverts on dark), Charlie Text 16px weight 500. Optional thin underline on hover.

### Ghost Button
Low-emphasis interactive — filter chips, toggle controls. Border 1px `#101214` or `#ffffff`, transparent fill, pill radius.

### Dark Hero Banner
Full-width `#101214` background, framed on left/right by jagged geometric color shapes (violet `#bf63f3`, yellow `#fca700`, blue `#1868db`, green). Charlie Display 80px weight 400-500 headline in white, left-aligned with supporting body at 16px. Primary button in vivid yellow (`#fca700`) for contrast against dark — the only place the yellow CTA appears.

### Lavender Feature Band
Full-width `#eed7fc` background, centered Charlie Display heading 32-40px weight 400 in `#101214`, body copy in `#101214` at 16px. No card containers — text floats on the tinted surface.

### Inverted Dark Section
`#101214` background spanning full width, left half white text content, right half visual. Charlie Display 40-48px weight 500 headline, Charlie Text 16px body.

### Top Navigation Bar
Sticky white bar, `#ffffff` background, bottom border 1px `#f0f1f2`. Wordmark at left. Menu items in Charlie Text 14px weight 400 `#101214`. Height ~56px.

### Info Badge
Pill shape (10000px radius), padding 4-6px horizontal, Charlie Text 13px weight 500. `#42526e` text on `#f0f1f2`, or `#1868db` text on `#e9f2fe` for brand-tinted variants.

### Card Container
`#ffffff` background, 20px border radius, 24px internal padding, minimal border (1px `#f0f1f2`) or the navy-tinted micro-shadow. No drop shadow at scale — the radius and whitespace do the lifting.

## Do's and Don'ts

### Do
- Use `#1868db` for every primary action button, link, and focus state — it is the only chromatic action color in the system
- Set card radius to 20px and button radius to 28px (or 10000px for full pill) — flatness is the point
- Pair Charlie Display weight 400-500 with Charlie Text weight 400-500; reserve weight 700+ for inline emphasis only
- Frame dark hero panels with geometric confetti shapes in violet (`#bf63f3`), yellow (`#fca700`), blue (`#1868db`), and green — never use these colors as fills inside functional UI
- Use `#eed7fc` lavender for editorial section dividers between white blocks; never use it for buttons or interactive elements
- Reach for the navy-tinted shadow stack (`rgba(9, 30, 66, ...)`) when any elevation is needed — never use neutral black shadows
- Set headlines at 40-80px with tightened 0.012em letter-spacing; body at 16px with 1.50 line-height

### Don't
- Don't introduce additional accent colors for UI — yellow, violet, and green are decorative-only and must never appear on buttons, links, or form controls
- Don't use heavy drop shadows or elevation stacks — the system is deliberately flat; depth comes from color inversion and radius alone
- Don't use sharp corners on cards or images — always apply 20px radius to cards and at least 5px to images
- Don't mix the two font families' weights arbitrarily — Charlie Text handles UI (13-24px), Charlie Display handles editorial (24-80px)
- Don't use black (`#000000`) as a background or large fill — it appears only as text and border ink; dark panels use `#101214`
- Don't place white text on lavender or blue — contrast pairs are dark-on-light or white-on-navy only
- Don't tile or repeat the confetti gradient — it is a single decorative frame device, not a pattern or texture

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background for content sections |
| 1 | Soft Surface | `#f0f1f2` | Muted buttons, subtle section bands, low-emphasis fills |
| 2 | Tinted Surface | `#e9f2fe` | Blue-tinted highlight wash, feature card backgrounds |
| 3 | Lavender Band | `#eed7fc` | Editorial accent sections, decorative dividers |
| 4 | Dark Panel | `#101214` | Hero banners, product feature blocks, inverted sections |

## Imagery

No photography, no 3D renders, no lifestyle imagery. Editorial decoration is colorful flat
geometric shapes — torn rectangles, angled bars, confetti fragments — in a fixed palette of
vivid violet, taxicab yellow, electric blue, and leaf green, framing dark panels only. The
visual energy comes entirely from these geometric color fragments.

## Layout

Full-width bands of alternating white and lavender (`#eed7fc`) sections, with occasional
full-bleed dark navy (`#101214`) panels that break the rhythm. Content is max-width 1200px
centered within each band. Navigation is a single sticky top bar. Vertical rhythm: 64-80px
between major sections, 24-40px within.

## Project-Specific Decisions

These extend the reference for surfaces a documentation product needs and the marketing
reference does not describe. They are binding.

### Fonts
Charlie Display and Charlie Text are licensed to Atlassian, so the substitutes named above
are used: **Manrope** (display) and **Inter** (text), self-hosted via `next/font`. They are
exposed as `--font-charlie-display` and `--font-charlie-text` so the real faces can be
dropped in without touching component code. All sizes, weights and tracking still come from
the type scale above.

### Code blocks — Dark Panel treatment
Code blocks use surface level 4 (`#101214`) with a Shiki dark theme, 8px radius (`--radius-inputs`),
no shadow, and a filename chip plus copy button in white. This follows the system's own
"depth comes from color inversion" principle and gives the highest-traffic surface in the
product strong figure/ground separation against the white canvas.

### Mermaid diagrams — documented palette exception
Diagrams are treated as **editorial illustration, not functional UI**, so they may use the
decorative four-color palette to distinguish services, datastores, queues and external
systems. This is a bounded exception to the decorative-only rule:

- allowed in Mermaid diagrams only, applied through the named `classDef`s in
  [`src/lib/content/mermaid-theme.ts`](src/lib/content/mermaid-theme.ts)
- never on buttons, links, form controls or any interactive element
- authors never write hex values in a diagram

### Display type responsive ramp
The 80px display size has no mobile guidance in the reference, so display type is clamped
between existing steps in the scale (40px → 80px) rather than inventing new sizes.

### Theme
Light only. The reference specifies no dark scheme. Semantic aliases are declared on `:root`
so a `[data-theme]` block can be added later in `theme.css` alone.
