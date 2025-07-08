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
    color: "#e22028",
  },
  {
    key: "prayermeeting",
    label: "Riunione Preghiera",
    placeholder: "Prayer Night",
    color: "#9bccd0",
  },
  {
    key: "biblestudy",
    label: "Studio Biblico",
    placeholder: "Studio",
    color: "#00492c",
  },
  {
    key: "preyervigil",
    label: "Veglia",
    placeholder: "Veglia notturna",
    color: "#fbba16",
  },
  {
    key: "youthmeeting",
    label: "Riunione Giovani",
    placeholder: "Youth Group",
    color: "#e04c26",
  },
  {
    key: "staffmeeting",
    label: "Incontro Team",
    placeholder: "Staff Meeting",
    color: "#b1d8b9",
  },
  {
    key: "rehearsal",
    label: "Prove Worship Team",
    placeholder: "Rehearsal",
    color: "#1f4381",
  },
  {
    key: "womensmeeting",
    label: "Incontro Donne",
    placeholder: "Donne di valore",
    color: "#e3b2b5",
  },
  {
    key: "mensmeeting",
    label: "Incontro Uomini",
    placeholder: "Mens Meeting ",
    color: "#5b30f5",
  },
  {
    key: "leadersmeeting",
    label: "Incontro Leader",
    placeholder: "Leaders Meeting",
    color: "#DBe64c",
  },
  {
    key: "custom1",
    label: "Incontro personalizzato 1",
    placeholder: "Incontro personalizzato 1",
    color: "#DBe64c",
  },
  {
    key: "custom2",
    label: "Incontro personalizzato 2",
    placeholder: "Incontro personalizzato 2",
    color: "#fc5a50",
  },
  {
    key: "custom3",
    label: "Incontro personalizzato 3",
    placeholder: "Incontro personalizzato 3",
    color: "#fc5a50",
  },
  {
    key: "custom4",
    label: "Incontro personalizzato 4",
    placeholder: "Incontro personalizzato 4",
    color: "#fc5a50",
  },
  {
    key: "custom5",
    label: "Incontro personalizzato 5",
    placeholder: "Incontro personalizzato 5",
    color: "#fc5a50",
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
