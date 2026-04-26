'use client';

import { clsx } from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive' | 'gold';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * Tabyn Button — v2 (Etap A)
 *
 * Variants:
 *   primary     — solid brand gradient (green → green-2) + glow shadow
 *   secondary   — tonal surface, the default for most actions
 *   tertiary    — outlined ghost, for inline or secondary-in-pair contexts
 *   ghost       — no surface, for navbar / inline links
 *   destructive — clay-red, for irreversible actions only
 *   gold        — NEW: gold gradient, for premium/featured moments only
 *
 * Sizes map to heights 40 / 48 / 56 — the 48px default clears WCAG 2.5.8
 * touch-target on all platforms.
 *
 * API is backwards-compatible with v1 — existing usages keep working.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading,
      fullWidth,
      className,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={clsx(
          // base
          'relative inline-flex items-center justify-center',
          'font-medium tracking-[-0.005em] whitespace-nowrap',
          'transition-[background,border,color,transform,box-shadow] duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'cursor-pointer select-none',
          // press effect
          'active:scale-[0.97]',
          {
            // primary — gradient + glow (UPGRADED)
            'bg-gradient-to-br from-brand to-brand-2 text-white shadow-glow-brand hover:brightness-[1.06]':
              variant === 'primary',
            // gold — gradient + glow (NEW)
            'bg-gradient-to-br from-brand-secondary-deep to-brand-secondary text-[#1A0F00] shadow-glow-gold hover:brightness-[1.05]':
              variant === 'gold',
            // secondary — tonal
            'bg-surface-2 text-text-primary border border-border-soft hover:bg-surface-3 hover:border-border-hard':
              variant === 'secondary',
            // tertiary — outlined quiet
            'bg-transparent text-text-primary border border-border-subtle hover:border-border-soft hover:bg-surface-2':
              variant === 'tertiary',
            // ghost — zero surface
            'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2':
              variant === 'ghost',
            // destructive
            'bg-destructive text-text-primary hover:brightness-110':
              variant === 'destructive',
          },
          {
            'h-10 text-[13px] px-4 gap-1.5 rounded-[10px]': size === 'sm',
            'h-12 text-[14px] px-5 gap-2 rounded-[12px]': size === 'md',
            'h-14 text-[15px] px-7 gap-2.5 rounded-[14px]': size === 'lg',
          },
          fullWidth && 'w-full',
          className,
        )}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        <span className={clsx('inline-flex items-center gap-2', loading && 'opacity-80')}>
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
