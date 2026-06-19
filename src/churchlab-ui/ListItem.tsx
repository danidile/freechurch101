import { ReactNode } from 'react';
import { cn } from './cn';

/** Contenitore lista con fili. */
export function List({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('border-t border-line', className)}>{children}</div>;
}

/** Riga di lista (membri, canti…). */
export function ListItem({
  leading,
  title,
  subtitle,
  trailing,
  className,
}: {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-[18px] border-b border-line px-1 py-[18px]',
        'transition-colors duration-150 hover:bg-cream',
        className
      )}
    >
      {leading}
      <div className="min-w-0 flex-1">
        <b className="block text-[14.5px] font-semibold">{title}</b>
        {subtitle && <span className="text-[12.5px] text-grey-light">{subtitle}</span>}
      </div>
      {trailing}
    </div>
  );
}
