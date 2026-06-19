'use client';
import { ButtonHTMLAttributes } from 'react';
import { cn } from './cn';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

/** Chip filtro (es. tonalità). Controllato dal genitore via selected/onClick. */
export function Chip({ selected, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5',
        'font-mono text-xs font-bold transition-colors duration-150 cursor-pointer',
        selected
          ? 'bg-accent border-accent text-white'
          : 'bg-white border-line text-grey hover:border-accent hover:text-accent',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
