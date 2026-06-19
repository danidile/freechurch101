import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse' | 'inverse-ghost';
type Size = 'md' | 'sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Mostra la freccia → che scivola al hover */
  arrow?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  secondary: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-white',
  ghost: 'bg-transparent text-ink border border-line hover:border-ink',
  danger: 'bg-err text-white hover:brightness-90',
  inverse: 'bg-white text-ink hover:bg-[#e7e7ea]', // su sezioni scure
  'inverse-ghost': 'bg-transparent text-white border border-white/35 hover:border-white',
};

const sizes: Record<Size, string> = {
  md: 'px-7 py-3.5 text-[15px]',
  sm: 'px-[18px] py-[9px] text-[13.5px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', arrow, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full font-semibold',
        'transition-colors duration-150 cursor-pointer',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-[3px]',
        'disabled:bg-line disabled:text-grey-light disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
      {arrow && (
        <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-[3px]">
          →
        </span>
      )}
    </button>
  )
);
Button.displayName = 'Button';
