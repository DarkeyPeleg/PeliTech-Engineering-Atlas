/**
 * Mermaid theming, derived from the design tokens.
 *
 * design.md treats diagrams as editorial illustration rather than functional UI,
 * which is the one bounded place the decorative palette may be used: it lets a
 * complex architecture diagram distinguish services from datastores from queues.
 * The exception is documented in design.md and CONTRIBUTING.md.
 *
 * Authors never write hex values. They apply the named classes below:
 *
 *   flowchart LR
 *     Client --> API
 *     API --> DB[(Postgres)]
 *     class Client external
 *     class API service
 *     class DB datastore
 */

import { brandColors } from '../design-tokens';

/** Mermaid is configured in JavaScript and resolves no CSS custom properties. */
const token = {
  navy: brandColors.midnightNavy,
  carbon: brandColors.carbonEdge,
  indigo: brandColors.mutedIndigo,
  white: brandColors.pureWhite,
  fog: brandColors.fogWhite,
  ash: brandColors.ashGray,
  blue: brandColors.atlassianBlue,
  tintedBlue: brandColors.tintedBlue,
  violet: brandColors.confettiViolet,
  lavender: brandColors.lavenderWash,
  yellow: brandColors.taxicabYellow,
  green: brandColors.confettiGreen,
  queueTint: brandColors.queueTint,
  cacheTint: brandColors.cacheTint,
} as const;

export const MERMAID_FONT_STACK =
  "var(--font-inter), ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

/**
 * `base` is the only built-in theme that honours every themeVariable, so it is
 * the right starting point for a custom palette.
 */
export const mermaidThemeVariables = {
  fontFamily: MERMAID_FONT_STACK,
  fontSize: '14px',

  // Default node
  primaryColor: token.fog,
  primaryTextColor: token.navy,
  primaryBorderColor: token.ash,
  secondaryColor: token.tintedBlue,
  secondaryTextColor: token.navy,
  secondaryBorderColor: token.blue,
  tertiaryColor: token.white,
  tertiaryTextColor: token.navy,
  tertiaryBorderColor: token.ash,

  background: token.white,
  mainBkg: token.fog,
  nodeBorder: token.ash,
  nodeTextColor: token.navy,
  titleColor: token.navy,

  // Edges
  lineColor: token.indigo,
  edgeLabelBackground: token.white,
  arrowheadColor: token.indigo,

  // Clusters / subgraphs
  clusterBkg: token.white,
  clusterBorder: token.ash,

  // Sequence diagrams
  actorBkg: token.tintedBlue,
  actorBorder: token.blue,
  actorTextColor: token.navy,
  actorLineColor: token.ash,
  signalColor: token.carbon,
  signalTextColor: token.carbon,
  labelBoxBkgColor: token.fog,
  labelBoxBorderColor: token.ash,
  labelTextColor: token.navy,
  loopTextColor: token.indigo,
  noteBkgColor: token.lavender,
  noteBorderColor: token.violet,
  noteTextColor: token.navy,
  activationBkgColor: token.fog,
  activationBorderColor: token.ash,
  sequenceNumberColor: token.white,

  // State diagrams
  labelColor: token.navy,
  altBackground: token.fog,

  // Class / ER diagrams
  classText: token.navy,
  attributeBackgroundColorOdd: token.white,
  attributeBackgroundColorEven: token.fog,

  // Gantt / journey
  taskBkgColor: token.tintedBlue,
  taskTextColor: token.navy,
  taskTextDarkColor: token.navy,
  taskTextOutsideColor: token.navy,
  activeTaskBkgColor: token.blue,
  activeTaskBorderColor: token.blue,
  gridColor: token.fog,
  doneTaskBkgColor: token.fog,
  critBorderColor: token.violet,
  critBkgColor: token.lavender,

  // Pie
  pie1: token.blue,
  pie2: token.violet,
  pie3: token.yellow,
  pie4: token.green,
  pieTitleTextColor: token.navy,
  pieSectionTextColor: token.white,
  pieStrokeColor: token.white,
} as const;

/**
 * Semantic node classes, prepended to every diagram so authors can label roles
 * without touching color. Extend this list rather than inlining a `style` line.
 */
export const MERMAID_CLASS_DEFS = [
  // Blue: things we build and run.
  `classDef service fill:${token.tintedBlue},stroke:${token.blue},stroke-width:1.5px,color:${token.navy};`,
  // Violet: state at rest.
  `classDef datastore fill:${token.lavender},stroke:${token.violet},stroke-width:1.5px,color:${token.navy};`,
  // Yellow: asynchronous transport.
  `classDef queue fill:${token.queueTint},stroke:${token.yellow},stroke-width:1.5px,color:${token.navy};`,
  // Green: caches and fast paths.
  `classDef cache fill:${token.cacheTint},stroke:${token.green},stroke-width:1.5px,color:${token.navy};`,
  // Neutral: systems outside our control.
  `classDef external fill:${token.fog},stroke:${token.indigo},stroke-width:1.5px,color:${token.navy};`,
  // Inverted: the emphasised node in a diagram.
  `classDef highlight fill:${token.navy},stroke:${token.navy},stroke-width:1.5px,color:${token.white};`,
] as const;

/**
 * Diagram types that reject `classDef`, so the definitions are only injected
 * where they are valid.
 */
const CLASS_DEF_UNSUPPORTED = [
  'sequencediagram',
  'erdiagram',
  'journey',
  'gantt',
  'pie',
  'mindmap',
  'timeline',
  'quadrantchart',
  'sankey',
  'xychart',
  'block',
  'packet',
  'architecture',
  'radar',
  'treemap',
];

function firstMeaningfulLine(chart: string): string {
  for (const line of chart.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%%')) continue;
    return trimmed.toLowerCase();
  }
  return '';
}

export function supportsClassDefs(chart: string): boolean {
  const header = firstMeaningfulLine(chart).replace(/[-\s].*$/, '');
  return !CLASS_DEF_UNSUPPORTED.some((type) => header.startsWith(type));
}

/** Appends the shared class definitions when the diagram type accepts them. */
export function withClassDefs(chart: string): string {
  if (!supportsClassDefs(chart)) return chart;
  if (chart.includes('classDef service')) return chart;
  return `${chart.trimEnd()}\n${MERMAID_CLASS_DEFS.join('\n')}`;
}

export const mermaidConfig = {
  startOnLoad: false,
  theme: 'base' as const,
  themeVariables: mermaidThemeVariables,
  securityLevel: 'strict' as const,
  fontFamily: MERMAID_FONT_STACK,
  flowchart: { htmlLabels: true, curve: 'basis' as const, useMaxWidth: true, padding: 16 },
  sequence: { useMaxWidth: true, actorMargin: 60, mirrorActors: false, wrap: true },
  er: { useMaxWidth: true },
  gantt: { useMaxWidth: true },
  journey: { useMaxWidth: true },
};
