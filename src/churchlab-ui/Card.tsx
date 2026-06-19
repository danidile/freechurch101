import { HTMLAttributes } from 'react';
import { cn } from './cn';

/** Card: bordo, mai ombra. L'ombra è riservata a ciò che flotta (modal, toast). */
export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-m border border-line bg-white p-6 transition-colors duration-150 hover:border-ink',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Riga meta in mono in fondo alla card. */
export function CardMeta({ className, children }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-3.5 flex items-center gap-3.5 font-mono text-[11.5px] text-grey-light', className)}>
      {children}
    </div>
  );
}
