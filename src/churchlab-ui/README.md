# ChurchLab UI — kit Oltremare

Componenti React per Next.js + Tailwind. **Un file per componente**, un solo
`index.ts` da cui importare tutto. Zero dipendenze esterne (solo React + Tailwind).
Modello shadcn: il codice è **tuo**, lo modifichi liberamente.

## Perché questa forma (e non un pacchetto npm)

Per un singolo progetto, una cartella drop-in è più semplice di un pacchetto:
niente build, niente publish, e i token Tailwind restano condivisi con la tua app.
La cartella è **autosufficiente** (helper `cn` incluso, import relativi), quindi
puoi metterla dove vuoi senza dipendere dai tuoi alias.

## Setup — 4 passi

**1) Copia la cartella** nel progetto, es. `./churchlab-ui/`
(accanto a `app/`). Per import puliti, aggiungi l'alias in `tsconfig.json`:
```jsonc
{ "compilerOptions": { "paths": { "@/churchlab-ui": ["./churchlab-ui"], "@/churchlab-ui/*": ["./churchlab-ui/*"] } } }
```

**2) Tailwind** — usa il preset e fai scansionare il kit:
```ts
// tailwind.config.ts
import churchlab from './churchlab-ui/preset';
export default {
  presets: [churchlab],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './churchlab-ui/**/*.{ts,tsx}',
  ],
};
```

**3) Token CSS** — importa una volta in cima a `app/globals.css`:
```css
@import '../churchlab-ui/styles.css';
```

**4) Font** — in `app/layout.tsx`:
```tsx
import { display, sans, mono } from '@/churchlab-ui/fonts';

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

## Uso

```tsx
import { Button, Card, Badge, Toggle, Dot, Display } from '@/churchlab-ui';

<Display>La domenica, organizzata<Dot /></Display>
<Button arrow>Crea la tua chiesa</Button>
<Badge tone="wait">In attesa</Badge>
<Toggle label="Iscrizioni aperte" checked={open} onChange={(e) => setOpen(e.target.checked)} />
```

Il **Toast** richiede il provider una volta (nel layout o in un wrapper client):
```tsx
import { ToastProvider, useToast } from '@/churchlab-ui';
// <ToastProvider>{children}</ToastProvider>
const { toast } = useToast();
toast('Canto aggiunto alla scaletta');
```

> Senza alias puoi sempre importare relativo: `import { Button } from '../../churchlab-ui'`.

## Anteprima

Copia `examples.tsx` in `app/(dev)/ui/page.tsx` e visita `/ui`.

## Componenti

`Button` · `Display/H2/Dot/SectionLabel/NumTag` · `Field` · `Input` · `Select` ·
`Textarea` · `Checkbox` · `Toggle` · `SearchInput` · `Badge` · `Chip` · `Card/CardMeta` ·
`Avatar` · `List/ListItem` · `Table/Th/Td` · `Tabs` · `Accordion/AccordionItem` ·
`Modal` · `ToastProvider/useToast` · `EmptyState` · `Skeleton` · helper `cn`

## Cambiare l'accento

Un punto solo: `styles.css` → `--accento`, `--accento-scuro`, `--accento-tenue`.
Palette testate: Oltremare `#2742E0` · Verderame `#1E6B5E` · Rosso `#D6402F` ·
Oro `#C2922E` · Viola `#7038C8`.

## Regole della casa

- L'accento colora grafica, numeri mono e testo grande — mai body text.
- Card col bordo, mai ombra. L'ombra è per ciò che flotta (modal, toast).
- Una sola sezione scura per pagina.
- Frasi brevi. Col punto.
