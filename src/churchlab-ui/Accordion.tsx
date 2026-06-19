import { ReactNode } from 'react';
import { cn } from './cn';

/** Contenitore FAQ. */
export function Accordion({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('[&>details:last-child]:border-b [&>details:last-child]:border-line', className)}>{children}</div>;
}

/** Voce FAQ basata su <details>: zero JS, accessibile. */
export function AccordionItem({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group border-t border-line">
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center justify-between gap-[18px] py-[22px]',
          'font-display text-[15.5px] font-semibold tracking-[-0.01em]',
          '[&::-webkit-details-marker]:hidden'
        )}
      >
        {title}
        <span
          aria-hidden
          className="shrink-0 text-[21px] text-grey-light transition-transform duration-200 group-open:rotate-45 group-open:text-accent"
        >
          +
        </span>
      </summary>
      <p className="pb-[22px] pr-10 text-[14.5px] text-grey">{children}</p>
    </details>
  );
}
