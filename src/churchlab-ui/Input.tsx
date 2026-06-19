import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** Variante per sezioni scure */
  dark?: boolean;
}

export const inputBase = cn(
  'w-full rounded-s border px-4 py-[13px] text-[15px] outline-none',
  'transition-colors duration-150 placeholder:text-grey-light'
);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, dark, className, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        inputBase,
        dark
          ? 'bg-[#1c1c1f] border-[#2e2e33] text-white placeholder:text-[#6e6e75] hover:border-[#4a4a52] focus:border-accent'
          : 'bg-white text-ink border-line hover:border-grey-light focus:border-accent',
        invalid && 'border-err',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
