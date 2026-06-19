import { cn } from './cn';

/** Placeholder shimmer durante il caricamento. Dimensiona con className. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-skel rounded-lg',
        'bg-[linear-gradient(90deg,#f1f1f3_25%,#e7e7ea_37%,#f1f1f3_63%)] bg-[length:400%_100%]',
        className
      )}
    />
  );
}
