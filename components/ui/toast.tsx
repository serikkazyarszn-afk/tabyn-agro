'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { Check, X, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

type ToastType = 'success' | 'error' | 'info' | 'transaction' | 'warning';

interface ToastInput {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastItem extends ToastInput {
  id: number;
}

interface ToastContextValue {
  push: (t: ToastInput) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * useToast — access the toast API from any client component.
 *
 * Usage:
 *   const toast = useToast();
 *   toast.push({ type: 'success', title: 'Done', message: 'Invested ₸500,000' });
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // In SSR or outside provider, return a no-op so components don't crash.
    return {
      push: () => {},
      dismiss: () => {},
    };
  }
  return ctx;
}

const ICONS: Record<ToastType, ReactNode> = {
  success: <Check className="w-4 h-4" strokeWidth={2.5} />,
  error: <X className="w-4 h-4" strokeWidth={2.5} />,
  info: <Info className="w-4 h-4" strokeWidth={2.5} />,
  warning: <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />,
  transaction: <span className="text-[15px] font-semibold leading-none">₸</span>,
};

const TONE: Record<ToastType, { bg: string; text: string; border: string }> = {
  success: { bg: 'bg-signal-up/15', text: 'text-signal-up', border: 'border-signal-up/25' },
  error: { bg: 'bg-signal-down/15', text: 'text-signal-down', border: 'border-signal-down/25' },
  info: { bg: 'bg-signal-info/15', text: 'text-signal-info', border: 'border-signal-info/25' },
  warning: { bg: 'bg-signal-warn/15', text: 'text-signal-warn', border: 'border-signal-warn/25' },
  transaction: { bg: 'bg-brand-secondary/15', text: 'text-brand-secondary', border: 'border-brand-secondary/25' },
};

/**
 * ToastProvider — wraps the app tree. Renders a fixed bottom-right stack.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (t: ToastInput) => {
      const id = Date.now() + Math.random();
      const next: ToastItem = { id, ...t };
      setToasts((prev) => [...prev, next]);
      const timeout = t.duration ?? 4200;
      setTimeout(() => dismiss(id), timeout);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-6 right-6 z-[998] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const type = toast.type ?? 'info';
  const tone = TONE[type];

  // Allow Escape key to dismiss the most recent toast.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDismiss]);

  return (
    <div
      role="status"
      className={clsx(
        'anim-toast-in pointer-events-auto',
        'min-w-[280px] max-w-[360px]',
        'bg-surface-2 border border-border-soft rounded-[14px]',
        'shadow-[0_12px_40px_rgba(0,0,0,0.6)]',
        'px-4 py-3 flex items-start gap-3',
      )}
    >
      <span
        className={clsx(
          'w-7 h-7 rounded-full shrink-0 inline-flex items-center justify-center',
          'border',
          tone.bg,
          tone.text,
          tone.border,
        )}
      >
        {ICONS[type]}
      </span>
      <div className="flex-1 min-w-0 pt-0.5">
        {toast.title && (
          <div className="text-[13px] font-semibold text-text-primary leading-tight mb-0.5">
            {toast.title}
          </div>
        )}
        <div className="text-[12.5px] text-text-secondary leading-[1.5]">
          {toast.message}
        </div>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors -mr-1 -mt-1 p-1 rounded-md"
      >
        <X className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
