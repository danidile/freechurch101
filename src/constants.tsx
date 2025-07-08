import { ChipColor } from "./utils/types/types";

export const keys = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
];

export const defaultEventTypes = [
  {
    key: "sundayservice",
    label: "Culto Domenicale",
    placeholder: "Sunday Gospel",
  },
  {
    key: "prayermeeting",
    label: "Riunione Preghiera",
    placeholder: "Prayer Night",
    
  },
  { key: "biblestudy", label: "Studio Biblico", placeholder: "Studio" },
  { key: "preyervigil", label: "Veglia", placeholder: "Veglia notturna" },
  {
    key: "youthmeeting",
    label: "Riunione Giovani",
    placeholder: "Youth Group",
  },
  { key: "staffmeeting", label: "Incontro Team", placeholder: "Staff Meeting" },
  {
    key: "rehearsal",
    label: "Prove Worship Team",
    placeholder: "Rehearsal",
  },
  {
    key: "womensmeeting",
    label: "Incontro Donne",
    placeholder: "Donne di valore",
  },
  {
    key: "mensmeeting",
    label: "Incontro Uomini",
    placeholder: "Mens Meeting ",
  },
  {
    key: "leadersmeeting",
    label: "Incontro Leader",
    placeholder: "Leaders Meeting",
  },
  {
    key: "custom1",
    label: "Incontro personalizzato 1",
    placeholder: "Incontro personalizzato 1",
  },
  {
    key: "custom2",
    label: "Incontro personalizzato 2",
    placeholder: "Incontro personalizzato 2",
  },
  {
    key: "custom3",
    label: "Incontro personalizzato 3",
    placeholder: "Incontro personalizzato 3",
  },
  {
    key: "custom4",
    label: "Incontro personalizzato 4",
    placeholder: "Incontro personalizzato 4",
  },
  {
    key: "custom5",
    label: "Incontro personalizzato 5",
    placeholder: "Incontro personalizzato 5",
  },
];

export const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "In attesa", color: "#edb85e" },
  confirmed: { label: "Confermato", color: "#6ecf87" },
  denied: { label: "Rifiutato", color: "#e24c7c" },
};

export const statusColorMap: Record<string, ChipColor> = {
  pending: "warning",
  confirmed: "success",
  denied: "danger",
};
