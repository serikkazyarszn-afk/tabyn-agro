'use client';

import { clsx } from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          {
            'bg-accent text-black hover:bg-accent-dim active:scale-[0.98]': variant === 'primary',
            'bg-surface border border-border text-foreground hover:bg-surface-hover active:scale-[0.98]': variant === 'secondary',
            'text-foreground hover:text-accent hover:bg-surface': variant === 'ghost',
            'bg-destructive text-white hover:bg-red-600 active:scale-[0.98]': variant === 'destructive',
          },
          {
            'text-xs px-3 py-1.5 rounded-md gap-1.5': size === 'sm',
            'text-sm px-4 py-2.5 rounded-lg gap-2': size === 'md',
            'text-base px-6 py-3.5 rounded-xl gap-2.5': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
