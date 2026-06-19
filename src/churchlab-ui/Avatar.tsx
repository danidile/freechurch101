import { cn } from './cn';

/** Avatar a iniziali. Uso: <Avatar name="Maria Rossi" /> */
export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        'flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full',
        'bg-accent-soft text-[13px] font-bold text-accent',
        className
      )}
    >
      {initials}
    </span>
  );
}
