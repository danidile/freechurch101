import { forwardRef } from 'react';
import { Input, InputProps } from './Input';
import { cn } from './cn';

export const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <div className={cn('relative', className)}>
      <svg
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
        width="16" height="16" viewBox="0 0 16 16" fill="none"
      >
        <circle cx="7" cy="7" r="5.2" stroke="var(--grigio-chiaro)" strokeWidth="1.5" />
        <path d="M11 11l3.4 3.4" stroke="var(--grigio-chiaro)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <Input ref={ref} type="search" className="pl-[42px]" {...props} />
    </div>
  )
);
SearchInput.displayName = 'SearchInput';
