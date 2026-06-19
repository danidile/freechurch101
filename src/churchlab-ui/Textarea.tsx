import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from './cn';
import { inputBase } from './Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid, className, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        inputBase,
        'min-h-24 resize-y bg-white text-ink border-line hover:border-grey-light focus:border-accent',
        invalid && 'border-err',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
