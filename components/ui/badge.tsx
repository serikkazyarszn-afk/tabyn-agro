import { clsx } from 'clsx';
import { HTMLAttributes } from 'react';

type Variant =
  | 'brand'
  | 'gold'
  | 'tech'
  | 'aqua'       // alias of tech
  | 'positive'
  | 'warning'
  | 'destructive'
  | 'neutral'
  | 'outline'
  | 'up'         // NEW: signal
  | 'down';      // NEW: signal

// Legacy variants still used by screens pending redesign
type LegacyVariant = 'accent' | 'success' | 'muted';

type Size = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant | LegacyVariant;
  size?: Size;
  dot?: boolean;
  live?: boolean; // NEW: pulsing dot for live/real-time indicators
}

/**
 * Tabyn Badge — v2 (Etap A)
 * Used ONLY for status, proof, risk, or region. Never for decoration.
 *
 * NEW in v2:
 *   - `live` prop — pulsing dot animation for real-time indicators
 *   - `up` / `down` variants — for financial signal deltas
 *   - `aqua` alias for `tech`
 *
 * Legacy support (back-compat):
 *   'accent' -> 'brand'
 *   'success' -> 'positive'
 *   'muted' -> 'neutral'
 */
export default function Badge({
  variant = 'neutral',
  size = 'sm',
  dot = false,
  live = false,
  className,
  children,
  ...props
}: BadgeProps) {
  // Back-compat normalisation
  const v: Variant =
    variant === 'accent'
      ? 'brand'
      : variant === 'success'
        ? 'positive'
        : variant === 'muted'
          ? 'neutral'
          : variant === 'aqua'
            ? 'tech'
            : (variant as Variant);

  const showDot = dot || live;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium tracking-[0.01em]',
        'whitespace-nowrap rounded-full border',
        size === 'sm' && 'text-[11px] px-2.5 py-0.5 leading-5',
        size === 'md' && 'text-[12px] px-3 py-1 leading-5',
        {
          'bg-brand/10 text-brand border-brand/25': v === 'brand',
          'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/25':
            v === 'gold',
          'bg-tech/10 text-tech border-tech/25': v === 'tech',
          'bg-positive/10 text-positive border-positive/25': v === 'positive',
          'bg-warning/10 text-warning border-warning/25': v === 'warning',
          'bg-destructive/10 text-destructive border-destructive/25':
            v === 'destructive',
          'bg-surface-2 text-text-secondary border-border-soft': v === 'neutral',
          'bg-transparent text-text-secondary border-border-soft': v === 'outline',
          'bg-signal-up/10 text-signal-up border-signal-up/25': v === 'up',
          'bg-signal-down/10 text-signal-down border-signal-down/25': v === 'down',
        },
        className,
      )}
      {...props}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={clsx(
            'h-1.5 w-1.5 rounded-full shrink-0',
            live && 'anim-pulse-dot',
            {
              'bg-brand': v === 'brand',
              'bg-brand-secondary': v === 'gold',
              'bg-tech': v === 'tech',
              'bg-positive': v === 'positive',
              'bg-warning': v === 'warning',
              'bg-destructive': v === 'destructive',
              'bg-text-tertiary': v === 'neutral' || v === 'outline',
              'bg-signal-up': v === 'up',
              'bg-signal-down': v === 'down',
            },
          )}
        />
      )}
      {children}
    </span>
  );
}
