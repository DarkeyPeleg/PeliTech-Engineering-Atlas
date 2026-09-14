'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { NavNode } from '@/lib/content/tree';
import { cn } from '@/lib/utils/cn';

/**
 * Recursive sidebar list.
 *
 * Client-side only because it needs the current pathname to mark the active item
 * and to decide which groups start expanded; the tree data itself is built on
 * the server and passed down, so no content logic ships to the browser.
 */

function isWithin(pathname: string, slug: string): boolean {
  return pathname === `/${slug}` || pathname.startsWith(`/${slug}/`);
}

function DocLink({ node, active }: { node: NavNode & { type: 'doc' }; active: boolean }) {
  return (
    <Link
      href={node.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'block rounded-nav border-l py-4 pl-12 font-charlie-text text-ui transition-colors',
        active
          ? 'border-accent font-medium text-accent'
          : 'border-border-subtle text-ink-muted hover:border-ink-muted hover:text-ink',
      )}
    >
      {node.label}
    </Link>
  );
}

function SectionGroup({ node, pathname, depth }: { node: NavNode & { type: 'section' }; pathname: string; depth: number }) {
  const containsCurrent = isWithin(pathname, node.slug);
  const [open, setOpen] = useState(containsCurrent || !node.collapsed);
  const hasChildren = node.children.length > 0;
  const active = pathname === `/${node.slug}`;

  return (
    <li className="mb-4">
      <div className="flex items-center gap-4">
        <Link
          href={node.href ?? `/${node.slug}`}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'flex-1 rounded-nav py-4 font-charlie-text text-ui transition-colors',
            depth === 0 ? 'font-medium' : 'pl-12',
            active ? 'text-accent' : 'text-ink hover:text-accent',
          )}
        >
          {node.label}
        </Link>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${node.label}`}
            className="shrink-0 rounded-nav px-4 py-4 font-mono text-caption text-ink-muted transition-colors hover:text-ink"
          >
            {open ? '−' : '+'}
          </button>
        ) : null}
      </div>

      {hasChildren && open ? (
        <ul className={cn('mt-4 list-none', depth === 0 ? 'ml-4' : 'ml-8')}>
          {node.children.map((child) =>
            child.type === 'section' ? (
              <SectionGroup key={child.slug} node={child} pathname={pathname} depth={depth + 1} />
            ) : (
              <li key={child.slug} className="mb-2">
                <DocLink node={child} active={pathname === child.href} />
              </li>
            ),
          )}
        </ul>
      ) : null}
    </li>
  );
}

export function SidebarTree({ nodes }: { nodes: NavNode[] }) {
  const pathname = usePathname();

  return (
    <ul className="list-none">
      {nodes.map((node) =>
        node.type === 'section' ? (
          <SectionGroup key={node.slug} node={node} pathname={pathname} depth={0} />
        ) : (
          <li key={node.slug} className="mb-2">
            <DocLink node={node} active={pathname === node.href} />
          </li>
        ),
      )}
    </ul>
  );
}
