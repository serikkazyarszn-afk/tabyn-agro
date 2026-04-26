import { clsx } from 'clsx';
import { HTMLAttributes, forwardRef } from 'react';

type Elevation = 'flat' | 'raised' | 'elevated' | 'proof' | 'glow';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation;
  hover?: boolean;
  padded?: boolean | 'sm' | 'md' | 'lg';
  /** NEW: radius override. Default: rounded-[20px] */
  radius?: 'md' | 'lg' | 'xl';
}

/**
 * Tabyn Card — v2 (Etap A)
 *
 * Elevations:
 *   flat     — surface-1, base listing card (default)
 *   raised   — surface-2, one step up (detail panels, modals)
 *   elevated — surface-3 + heavier shadow (invest cards, CTAs)
 *   proof    — gradient-proof, trust / due-diligence blocks
 *   glow     — NEW: gradient border on hover (premium feel)
 *
 * New in v2:
 *   - `glow` elevation — animated gradient border on hover
 *   - Hover lift is smoother (translate + proper shadow)
 *   - `radius` prop for flexibility
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      elevation = 'flat',
      hover = false,
      padded = false,
      radius = 'lg',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'relative border transition-[border-color,transform,box-shadow] duration-250',
          // radius
          radius === 'md' && 'rounded-[14px]',
          radius === 'lg' && 'rounded-[20px]',
          radius === 'xl' && 'rounded-[28px]',
          // elevations
          {
            'bg-surface-1 border-border-subtle': elevation === 'flat',
            'bg-surface-2 border-border-soft': elevation === 'raised',
            'bg-surface-3 border-border-soft shadow-2': elevation === 'elevated',
            'gradient-proof border-border-subtle': elevation === 'proof',
            'bg-surface-2 border-border-soft': elevation === 'glow',
          },
          // hover
          hover &&
            'hover:border-border-hard hover:-translate-y-[3px] hover:shadow-lifted',
          // glow variant — gradient border on hover via pseudo-element
          elevation === 'glow' && [
            'before:content-[""] before:absolute before:inset-[-1px]',
            'before:rounded-[inherit] before:opacity-0',
            'before:bg-[linear-gradient(135deg,rgba(31,133,102,0.5),rgba(224,176,96,0.3),rgba(79,169,160,0.4))]',
            'before:transition-opacity before:duration-300 before:-z-10',
            'hover:before:opacity-100',
          ],
          // padding
          padded === true && 'p-6',
          padded === 'sm' && 'p-4',
          padded === 'md' && 'p-6',
          padded === 'lg' && 'p-8',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
export default Card;
