import type { Config } from 'tailwindcss';

/**
 * Preset Tailwind di ChurchLab UI.
 * Nel tuo tailwind.config.ts:
 *
 *   import churchlab from './churchlab-ui/preset';
 *   export default {
 *     presets: [churchlab],
 *     content: [
 *       './app/**\/*.{ts,tsx}',
 *       './components/**\/*.{ts,tsx}',
 *       './churchlab-ui/**\/*.{ts,tsx}',   // <-- importante: fai scansionare il kit
 *     ],
 *   } satisfies Config;
 *
 * Nota: i colori puntano a CSS variables (styles.css), così l'accento
 * si cambia a runtime. Con var() i modificatori di opacità (text-accent/50)
 * non funzionano: è una scelta voluta per il theming dinamico.
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        ink: 'var(--nero)',
        grey: { DEFAULT: 'var(--grigio)', light: 'var(--grigio-chiaro)' },
        line: 'var(--filo)',
        cream: 'var(--panna)',
        accent: {
          DEFAULT: 'var(--accento)',
          dark: 'var(--accento-scuro)',
          soft: 'var(--accento-tenue)',
        },
        ok: 'var(--ok)',
        wait: 'var(--attesa)',
        err: 'var(--errore)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: { s: '12px', m: '16px', l: '20px' },
      boxShadow: {
        float: '0 8px 30px rgba(0,0,0,.12)',
        modal: '0 30px 80px rgba(0,0,0,.3)',
      },
      keyframes: {
        skel: {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '0 0' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'translateY(14px) scale(0.98)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        skel: 'skel 1.3s ease infinite',
        'modal-in': 'modal-in 250ms ease',
      },
    },
  },
};

export default preset;
