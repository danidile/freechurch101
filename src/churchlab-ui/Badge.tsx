import { ReactNode } from 'react';
import { cn } from './cn';

type Tone = 'ok' | 'wait' | 'err' | 'neutral' | 'dark';

const tones: Record<Tone, string> = {
  ok: 'text-ok bg-[#e9f2f0]',
  wait: 'text-wait bg-[#f9f2e2]',
  err: 'text-err bg-[#fbeae8]',
  neutral: 'text-grey bg-cream',
  dark: 'text-[#cfd6ff] bg-white/10 before:!bg-accent', // su sezioni scure
};

export function Badge({
  tone = 'neutral',
  className,
  children,
}: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[7px] rounded-full px-[13px] py-[5px] text-[12.5px] font-semibold',
        "before:content-[''] before:h-1.5 before:w-1.5 before:rounded-full before:bg-current",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
