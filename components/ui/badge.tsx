import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'success' | 'warning' | 'muted' | 'destructive';
  className?: string;
}

export default function Badge({ children, variant = 'muted', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full',
        {
          'bg-accent/10 text-accent border border-accent/20': variant === 'accent',
          'bg-success/10 text-success border border-success/20': variant === 'success',
          'bg-warning/10 text-warning border border-warning/20': variant === 'warning',
          'bg-surface text-muted border border-border': variant === 'muted',
          'bg-destructive/10 text-destructive border border-destructive/20': variant === 'destructive',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
