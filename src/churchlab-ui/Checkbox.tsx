import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './cn';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => (
    <label className={cn('flex cursor-pointer items-center gap-[11px] text-[14.5px]', className)}>
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'relative h-[19px] w-[19px] shrink-0 cursor-pointer appearance-none rounded-md',
          'border-[1.5px] border-grey-light transition-colors duration-150',
          'checked:border-accent checked:bg-accent',
          "after:content-['✓'] after:absolute after:inset-0 after:hidden after:items-center after:justify-center",
          'after:text-xs after:font-bold after:text-white checked:after:flex',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2'
        )}
        {...props}
      />
      {label}
    </label>
  )
);
Checkbox.displayName = 'Checkbox';
