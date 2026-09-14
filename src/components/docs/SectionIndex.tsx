import Link from 'next/link';
import type { NavNode } from '@/lib/content/tree';
import { DocMetaInline } from './DocMeta';

/**
 * Listing for a directory. Renders below a section's `index.mdx` when it has one,
 * and stands in as the whole page when it does not — which is why a taxonomy
 * folder can exist before anyone has written its introduction.
 */

function ChildCard({ node }: { node: NavNode }) {
  const href = node.type === 'doc' ? node.href : (node.href ?? `/${node.slug}`);
  const description = node.type === 'doc' ? node.description : node.description;
  const count = node.type === 'section' ? node.children.length : 0;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-cards border border-border-subtle p-24 transition-colors hover:border-accent"
    >
      <span className="font-charlie-display text-subheading font-medium text-ink group-hover:text-accent">
        {node.label}
      </span>

      {description ? (
        <span className="mt-8 flex-1 font-charlie-text text-ui text-ink-muted">{description}</span>
      ) : (
        <span className="flex-1" />
      )}

      <span className="mt-16 flex items-center justify-between gap-8">
        {node.type === 'doc' ? (
          <DocMetaInline difficulty={node.difficulty} />
        ) : (
          <span className="font-charlie-text text-caption text-ink-muted">
            {count === 0 ? 'Coming soon' : `${count} ${count === 1 ? 'topic' : 'topics'}`}
          </span>
        )}
      </span>
    </Link>
  );
}

export function SectionIndex({ nodes, heading }: { nodes: NavNode[]; heading?: string }) {
  if (nodes.length === 0) {
    return (
      <p className="mt-24 font-charlie-text text-body text-ink-muted">
        No articles here yet. This section is part of the planned structure — contributions are
        welcome.
      </p>
    );
  }

  return (
    <section className="mt-32">
      {heading ? (
        <h2 className="mb-16 font-charlie-display text-heading-sm font-medium text-ink">
          {heading}
        </h2>
      ) : null}
      <ul className="grid list-none gap-16 md:grid-cols-2">
        {nodes.map((node) => (
          <li key={node.slug} className="h-full">
            <ChildCard node={node} />
          </li>
        ))}
      </ul>
    </section>
  );
}
