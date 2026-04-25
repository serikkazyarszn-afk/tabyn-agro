'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type Variant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  variant: Variant;
}

interface ToastCtx {
  toast: (opts: { message: string; variant?: Variant }) => void;
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(({ message, variant = 'info' }: { message: string; variant?: Variant }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl text-sm font-medium shadow-xl max-w-xs ${
              t.variant === 'success' ? 'bg-accent text-black' :
              t.variant === 'error' ? 'bg-red-500 text-white' :
              'bg-surface border border-border text-foreground'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
