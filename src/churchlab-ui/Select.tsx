import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from './cn';
import { inputBase } from './Input';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ invalid, className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          inputBase,
          'appearance-none bg-white pr-10 text-ink border-line hover:border-grey-light focus:border-accent cursor-pointer',
          invalid && 'border-err',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        width="12" height="8" viewBox="0 0 12 8" fill="none"
      >
        <path d="M1 1l5 5 5-5" stroke="var(--grigio)" strokeWidth="1.5" />
      </svg>
    </div>
  )
);
Select.displayName = 'Select';
