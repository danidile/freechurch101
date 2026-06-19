'use client';
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { cn } from './cn';

const ToastContext = createContext<{ toast: (msg: string) => void }>({ toast: () => {} });

/** Avvolgi l'app (o il layout) con <ToastProvider>, poi usa useToast(). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((m: string) => {
    setMsg(m);
    setShow(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2.5',
          'rounded-full bg-ink px-[22px] py-[13px] text-sm font-medium text-white shadow-float',
          'transition-all duration-300',
          show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        )}
      >
        <span className="font-bold text-accent">✓</span> {msg}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
