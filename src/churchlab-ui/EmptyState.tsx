import { ReactNode } from 'react';
import { cn } from './cn';

/** Stato vuoto — il primo schermo di ogni chiesa nuova. */
export function EmptyState({
  icon = '♪',
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-[520px] rounded-l border-[1.5px] border-dashed border-[#d9d9dd] px-[30px] py-[54px] text-center',
        className
      )}
    >
      <div className="mx-auto mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent-soft text-[22px] text-accent">
        {icon}
      </div>
      <h4 className="mb-1.5 font-display text-lg font-bold tracking-[-0.015em]">{title}</h4>
      {description && <p className="mb-[22px] text-sm text-grey">{description}</p>}
      {action}
    </div>
  );
}
