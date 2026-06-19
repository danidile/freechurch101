import { HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

/** Il punto finale nell'accento. Solo nei titoli display, una volta per sezione. */
export function Dot({ char = '.' }: { char?: string }) {
  return <span className="text-accent">{char}</span>;
}

/** Titolo display. Uso: <Display>La domenica, organizzata<Dot /></Display> */
export function Display({
  as: Tag = 'h1',
  className,
  children,
  ...props
}: { as?: 'h1' | 'h2'; children: ReactNode } & HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Tag
      className={cn(
        'font-display font-extrabold tracking-[-0.03em] leading-[1.04]',
        'text-[clamp(42px,6vw,76px)]',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Titolo di sezione (34px). */
export function H2({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn('font-display font-bold tracking-[-0.025em] text-[34px] leading-[1.08]', className)} {...props}>
      {children}
    </h2>
  );
}

/** Etichetta mono di sezione. Uso: <SectionLabel num="01">TUTTO IN SCALETTA</SectionLabel> */
export function SectionLabel({
  num,
  className,
  children,
}: { num?: string; className?: string; children: ReactNode }) {
  return (
    <span className={cn('block font-mono text-[12.5px] tracking-[.04em] text-grey', className)}>
      {num && <b className="text-accent font-bold">{num}</b>}
      {num && <>&nbsp;&nbsp;</>}
      {children}
    </span>
  );
}

/** Numero/tonalità in mono accento: 01 · SOL · MI− */
export function NumTag({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn('font-mono font-bold text-[13px] text-accent', className)}>{children}</span>;
}
