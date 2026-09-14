import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Actions, per design.md: pill radius, flat, no shadow — "the color does the work".
 *
 * `primary` is the only filled treatment and always uses the single action color.
 * `onDark` switches to the yellow CTA, which design.md permits only on dark panels.
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark';
type Size = 'md' | 'sm';

const base =
  'inline-flex items-center justify-center gap-8 font-charlie-text font-medium ' +
  'transition-colors disabled:pointer-events-none disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-ink',
  secondary: 'text-ink hover:underline underline-offset-4 decoration-1',
  ghost: 'border border-ink text-ink hover:bg-surface-soft',
  // Yellow CTA — dark panels only.
  onDark: 'bg-accent-on-dark text-ink hover:bg-ink-inverted',
};

const sizes: Record<Size, string> = {
  md: 'text-body px-20 py-12 rounded-buttons',
  sm: 'text-ui px-16 py-8 rounded-full',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>;
type AnchorProps = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<'a'>,
    'className' | 'children' | 'href'
  >;

function classes(variant: Variant, size: Size, className?: string): string {
  // `secondary` is a text link, so horizontal padding would misalign it.
  const sizing = variant === 'secondary' ? (size === 'sm' ? 'text-ui' : 'text-body') : sizes[size];
  return cn(base, variants[variant], sizing, className);
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  ...props
}: AnchorProps) {
  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes(variant, size, className)}
        rel="noreferrer noopener"
        target="_blank"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
