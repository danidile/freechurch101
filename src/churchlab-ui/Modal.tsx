'use client';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from './cn';

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/50 p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn('w-full max-w-[440px] rounded-l bg-white p-[30px] pb-[26px] shadow-modal', 'animate-modal-in')}
      >
        <div className="mb-1.5 flex items-start justify-between">
          <h3 className="font-display text-[21px] font-bold tracking-[-0.02em]">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="h-8 w-8 shrink-0 rounded-full border border-line text-base leading-none text-grey transition-colors hover:border-ink hover:text-ink"
          >
            ✕
          </button>
        </div>
        {description && <p className="mb-[22px] text-sm text-grey">{description}</p>}
        {children}
        {footer && <div className="mt-6 flex justify-end gap-2.5">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
