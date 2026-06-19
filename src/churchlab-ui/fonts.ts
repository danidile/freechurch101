import { Schibsted_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

export const display = Schibsted_Grotesk({
  subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-display',
});
export const sans = Inter({
  subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans',
});
export const mono = JetBrains_Mono({
  subsets: ['latin'], weight: ['500', '700'], variable: '--font-mono',
});

/* In app/layout.tsx:
   import { display, sans, mono } from '@/churchlab-ui/fonts';
   <html className={`${display.variable} ${sans.variable} ${mono.variable}`}> ...
*/
