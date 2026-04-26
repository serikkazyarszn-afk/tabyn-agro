'use client';

import { clsx } from 'clsx';
import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

/**
 * Tabyn Input
 * - Persistent labels (no placeholder-as-label).
 * - 48px tall by default — clears mobile touch targets.
 * - Helper text and error states occupy reserved space so the form
 *   does not jump when errors appear.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, hint, error, leading, trailing, className, id, disabled, ...props },
    ref,
  ) => {
    const invalid = Boolean(error);
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-[13px] font-medium text-text-secondary tracking-[0.01em]"
          >
            {label}
          </label>
        )}
        <div
          className={clsx(
            'flex items-center w-full h-12',
            'bg-surface-900 border rounded-[12px] transition-colors',
            invalid
              ? 'border-destructive focus-within:border-destructive'
              : 'border-border-700 focus-within:border-brand',
            'focus-within:ring-2 focus-within:ring-brand/40',
            disabled && 'opacity-60 cursor-not-allowed',
          )}
        >
          {leading && (
            <span className="pl-4 text-text-tertiary flex items-center">
              {leading}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={invalid || undefined}
            aria-describedby={
              error ? `${id}-error` : hint ? `${id}-hint` : undefined
            }
            disabled={disabled}
            className={clsx(
              'flex-1 min-w-0 bg-transparent px-4 text-[14px]',
              'text-text-primary placeholder:text-text-tertiary',
              'focus:outline-none',
              leading && 'pl-2',
              trailing && 'pr-2',
              className,
            )}
            {...props}
          />
          {trailing && (
            <span className="pr-3 text-text-tertiary flex items-center">
              {trailing}
            </span>
          )}
        </div>
        <div className="min-h-[16px]">
          {error ? (
            <p
              id={`${id}-error`}
              className="text-[12px] text-destructive leading-4"
            >
              {error}
            </p>
          ) : hint ? (
            <p
              id={`${id}-hint`}
              className="text-[12px] text-text-tertiary leading-4"
            >
              {hint}
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
