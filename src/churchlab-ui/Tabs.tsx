'use client';
import { cn } from './cn';

export interface TabItem {
  id: string;
  label: string;
}

/** Tabs a sottolineatura. Controllate: value + onChange. */
export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={cn('flex gap-[26px] border-b border-line', className)}>
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(it.id)}
            className={cn(
              '-mb-px border-b-2 px-0.5 py-3 text-[14.5px] font-semibold transition-colors duration-150',
              on ? 'border-accent text-ink' : 'border-transparent text-grey hover:text-ink'
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
