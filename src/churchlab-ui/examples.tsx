'use client';
/**
 * Anteprima del kit. Copiala in app/(dev)/ui/page.tsx e visita /ui.
 * Mostra come importare TUTTO da un solo posto: '@/churchlab-ui'.
 */
import { useState } from 'react';
import {
  Accordion, AccordionItem, Avatar, Badge, Button, Card, CardMeta, Checkbox, Chip,
  Display, Dot, EmptyState, Field, Input, List, ListItem, Modal, NumTag, SearchInput,
  SectionLabel, Select, Skeleton, Table, Tabs, Td, Textarea, Th, Toggle,
  ToastProvider, useToast,
} from '.';

const KEYS = ['SOL', 'LA', 'SI−', 'DO', 'RE', 'MI−'];

function Inner() {
  const [tab, setTab] = useState('scaletta');
  const [k, setK] = useState('SOL');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  return (
    <main className="mx-auto grid max-w-[1040px] gap-16 px-7 py-20">
      <SectionLabel num="00">CHURCHLAB UI — ANTEPRIMA</SectionLabel>
      <Display>La domenica, organizzata<Dot /></Display>

      <div className="flex flex-wrap gap-3.5">
        <Button arrow onClick={() => toast('Fatto')}>Crea la tua chiesa</Button>
        <Button variant="secondary">Funzioni</Button>
        <Button variant="ghost">Annulla</Button>
        <Button variant="danger" size="sm">Elimina</Button>
      </div>

      <div className="grid max-w-[480px] gap-5">
        <Field label="Nome della chiesa" htmlFor="n" hint="Apparirà nel link pubblico.">
          <Input id="n" placeholder="Es. Chiesa di Milano" />
        </Field>
        <Field label="Ruolo" htmlFor="r">
          <Select id="r"><option>Pastore</option><option>Leader di lode</option></Select>
        </Field>
        <SearchInput placeholder="Cerca un canto…" />
        <Checkbox label="Accetto i termini" defaultChecked />
        <Toggle label="Iscrizioni aperte" defaultChecked />
      </div>

      <div className="flex flex-wrap gap-3.5">
        <Badge tone="ok">Attivo</Badge><Badge tone="wait">In attesa</Badge>
        <Badge tone="err">Bloccato</Badge>
        {KEYS.map((t) => <Chip key={t} selected={k === t} onClick={() => setK(t)}>{t}</Chip>)}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h4 className="font-display text-[17px] font-bold">Culto della domenica</h4>
          <p className="text-sm text-grey">14 giugno · 10:30 — 4 canti.</p>
          <CardMeta><span>SOL · 72 BPM</span><NumTag>04 voci</NumTag></CardMeta>
        </Card>
        <List>
          <ListItem leading={<Avatar name="Maria Rossi" />} title="Maria Rossi"
            subtitle="Leader di lode" trailing={<Badge tone="ok" className="px-2.5 py-[3px] text-[11px]">Attivo</Badge>} />
        </List>
      </div>

      <Table>
        <thead><tr><Th>Canto</Th><Th>Tonalità</Th></tr></thead>
        <tbody><tr><Td className="font-semibold">Grande è il Signore</Td><Td><NumTag>SOL</NumTag></Td></tr></tbody>
      </Table>

      <Tabs items={[{ id: 'scaletta', label: 'Scaletta' }, { id: 'canti', label: 'Canti' }]} value={tab} onChange={setTab} />
      <Accordion className="max-w-[680px]">
        <AccordionItem title="È davvero gratis?" defaultOpen>Sì, per sempre.</AccordionItem>
      </Accordion>
      <EmptyState title="Nessun canto" description="Parti da qui."
        action={<Button size="sm" arrow onClick={() => setOpen(true)}>Aggiungi</Button>} />
      <Skeleton className="h-5 w-40" />

      <Modal open={open} onClose={() => setOpen(false)} title="Aggiungi canto"
        footer={<Button size="sm" onClick={() => { setOpen(false); toast('Aggiunto'); }}>Salva</Button>}>
        <Field label="Titolo" htmlFor="t"><Input id="t" placeholder="Es. Tu sei santo" /></Field>
      </Modal>
    </main>
  );
}

export default function Examples() {
  return <ToastProvider><Inner /></ToastProvider>;
}
