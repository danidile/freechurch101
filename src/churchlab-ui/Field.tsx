import { ReactNode } from 'react';
import { cn } from './cn';

/** Wrapper label + hint + errore per qualsiasi controllo. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-2 block text-[13px] font-semibold">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-[7px] text-[12.5px] text-err">{error}</p>
      ) : hint ? (
        <p className={cn('mt-[7px] text-[12.5px] text-grey-light')}>{hint}</p>
      ) : null}
    </div>
  );
}
