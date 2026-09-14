import { cn } from '@/lib/utils/cn';

/**
 * The signature framing device from design.md: asymmetric torn-rectangle and
 * angled-bar fragments in the decorative four-color palette, bleeding off the
 * edges of a dark panel.
 *
 * Built from clip-path polygons rather than image assets — flat fills, no
 * gradients, no shadows, no stroke, and nothing to keep in sync in /public. It is
 * decorative only, so it is hidden from assistive technology, and per design.md
 * it frames dark surfaces exclusively and is never tiled.
 */

interface Shard {
  className: string;
  style: React.CSSProperties;
}

/* Left cluster. Sizes are deliberately uneven — the shapes should read as torn. */
const leftShards: Shard[] = [
  {
    className: 'bg-decor-violet',
    style: {
      top: '8%',
      left: '-3%',
      width: '96px',
      height: '150px',
      clipPath: 'polygon(0 0, 100% 12%, 78% 100%, 6% 82%)',
    },
  },
  {
    className: 'bg-decor-yellow',
    style: {
      top: '48%',
      left: '3%',
      width: '58px',
      height: '58px',
      clipPath: 'polygon(0 18%, 100% 0, 88% 100%, 12% 86%)',
    },
  },
  {
    className: 'bg-decor-blue',
    style: {
      bottom: '4%',
      left: '-1%',
      width: '132px',
      height: '46px',
      clipPath: 'polygon(0 0, 100% 22%, 94% 100%, 4% 74%)',
    },
  },
  {
    className: 'bg-decor-green',
    style: {
      top: '30%',
      left: '9%',
      width: '30px',
      height: '92px',
      clipPath: 'polygon(0 6%, 100% 0, 100% 94%, 14% 100%)',
    },
  },
];

/* Right cluster, intentionally not a mirror of the left. */
const rightShards: Shard[] = [
  {
    className: 'bg-decor-yellow',
    style: {
      top: '6%',
      right: '-2%',
      width: '120px',
      height: '92px',
      clipPath: 'polygon(10% 0, 100% 8%, 92% 100%, 0 78%)',
    },
  },
  {
    className: 'bg-decor-blue',
    style: {
      top: '38%',
      right: '6%',
      width: '46px',
      height: '128px',
      clipPath: 'polygon(0 0, 100% 10%, 84% 100%, 16% 90%)',
    },
  },
  {
    className: 'bg-decor-violet',
    style: {
      bottom: '10%',
      right: '-4%',
      width: '150px',
      height: '110px',
      clipPath: 'polygon(6% 4%, 100% 0, 100% 88%, 0 100%)',
    },
  },
  {
    className: 'bg-decor-green',
    style: {
      bottom: '2%',
      right: '14%',
      width: '64px',
      height: '34px',
      clipPath: 'polygon(0 12%, 100% 0, 90% 100%, 8% 88%)',
    },
  },
];

interface ConfettiFrameProps {
  /** Hides the fragments below `lg`, where they would crowd the headline. */
  hideOnSmall?: boolean;
  className?: string;
}

export function ConfettiFrame({ hideOnSmall = true, className }: ConfettiFrameProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden select-none',
        hideOnSmall && 'hidden lg:block',
        className,
      )}
    >
      {[...leftShards, ...rightShards].map((shard, index) => (
        <span key={index} className={cn('absolute block', shard.className)} style={shard.style} />
      ))}
    </div>
  );
}

/**
 * The conic-gradient frame, reserved by design.md for the single most prominent
 * block on a page. A 1px inset creates the border effect without a stroke.
 */
export function ConfettiGradientFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('relative p-8', className)}
      style={{ background: 'var(--gradient-confetti)', borderRadius: 'var(--radius-cards)' }}
    >
      <div className="relative rounded-cards bg-surface-inverted">{children}</div>
    </div>
  );
}
