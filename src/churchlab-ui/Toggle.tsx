import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './cn';

export interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/** Interruttore (es. "Iscrizioni aperte"). Controllato via checked/onChange. */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, className, ...props }, ref) => (
    <label className={cn('flex cursor-pointer items-center gap-3 text-[14.5px]', className)}>
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className={cn(
          'relative h-6 w-[42px] shrink-0 cursor-pointer appearance-none rounded-full bg-line',
          'transition-colors duration-200 checked:bg-accent',
          "after:content-[''] after:absolute after:left-[3px] after:top-[3px] after:h-[18px] after:w-[18px]",
          'after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-200',
          'checked:after:translate-x-[18px]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2'
        )}
        {...props}
      />
      {label}
    </label>
  )
);
Toggle.displayName = 'Toggle';
