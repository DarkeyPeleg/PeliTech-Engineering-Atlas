import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Mermaid } from '@/components/mdx/Mermaid';
import { Diagram } from '@/components/mdx/Diagram';
import { Steps, Step } from '@/components/mdx/Steps';
import { TradeOffs } from '@/components/mdx/TradeOffs';
import { ComparisonTable } from '@/components/mdx/ComparisonTable';
import { FailureScenarios } from '@/components/mdx/FailureScenarios';
import { Requirements, CapacityEstimate } from '@/components/mdx/Requirements';
import { KeyTakeaways } from '@/components/mdx/KeyTakeaways';
import {
  Callout,
  CommonMistake,
  Note,
  ScalabilityNote,
  SecurityNote,
  Tip,
  Warning,
} from '@/components/mdx/Callout';

/**
 * Everything an article author can use, in one registry.
 *
 * Adding a component here makes it available in every `.mdx` file with no
 * import, which is what keeps articles free of application concerns. Element
 * overrides below are limited to behaviour that markup alone cannot express —
 * all typography comes from the `article-prose` layer in globals.css.
 */

/** Internal links get client-side navigation; external links get safe rel attrs. */
function Anchor({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const isInternal = href.startsWith('/') || href.startsWith('#');

  if (isInternal) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
      {children}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  a: Anchor,
  pre: CodeBlock,

  // Diagrams
  Mermaid,
  Diagram,

  // Structure
  Steps,
  Step,
  Requirements,
  CapacityEstimate,
  KeyTakeaways,

  // Analysis
  TradeOffs,
  ComparisonTable,
  FailureScenarios,

  // Asides
  Callout,
  Note,
  Tip,
  Warning,
  SecurityNote,
  ScalabilityNote,
  CommonMistake,
};

/** Next.js convention, so `@next/mdx` tooling and editors resolve the same set. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}
