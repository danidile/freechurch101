// Map semitone distance to Nashville numbers with accidentals
export const semitoneToNashville: Record<number, string> = {
  0: "1",
  1: "#1",
  2: "2",
  3: "b3",
  4: "3",
  5: "4",
  6: "#4",
  7: "5",
  8: "b6",
  9: "6",
  10: "b7",
  11: "7",
};

// Improved chord regex - more strict and specific
export const chordRegex =
  /\b([A-G]|Do|Re|Mi|Fa|Sol|La|Si)([#b♯♭]?)((?:maj|min|dim|aug|sus|add|m|M|\+|°|ø)?(?:\d+)?(?:[#b♯♭]\d+)?(?:\/(?:[A-G]|Do|Re|Mi|Fa|Sol|La|Si)[#b♯♭]?)?)(?=\s|$)/gi;

export type ParsedLine =
  | { type: "section"; text: string }
  | { type: "chords"; text: string }
  | { type: "lyrics"; text: string };

export const SECTION_KEYWORDS = new Set([
  // English
  "intro",
  "verse",
  "chorus",
  "pre-chorus",
  "prechorus",
  "bridge",
  "interlude",
  "instrumental",
  "outro",
  "ending",
  "tag",
  "refrain",
  "hook",
  "break",
  "solo",
  "coda",
  "middle 8",

  // Italian
  "strofa",
  "ritornello",
  "pre-ritornello",
  "ponte",
  "coro",
  "interludio",
  "strumentale",
  "finale",
  "verso",
  "pre-coro",
  "precoro",
  "ripresa",
  "special",
  "assolo",

  // Additional common patterns
  "verse 1",
  "verse 2",
  "verse 3",
  "chorus 1",
  "chorus 2",
  "v1",
  "v2",
  "v3",
  "c1",
  "c2",
  "ch1",
  "ch2",
]);

export const IT_TO_EN: Record<string, string> = {
  Do: "C",
  Re: "D",
  Mi: "E",
  Fa: "F",
  Sol: "G",
  La: "A",
  Si: "B",
};

export const EN_TO_IT: Record<string, string> = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};

// Notes in semitone order, starting from C
export const CHROMATIC_SCALE_SHARP = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const CHROMATIC_SCALE_FLAT = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

// Create mapping from note name to semitone index
export const NOTE_TO_SEMITONE: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

// Valid chord suffixes to help distinguish real chords from words
export const VALID_CHORD_SUFFIXES = new Set([
  "",
  "m",
  "maj",
  "min",
  "dim",
  "aug",
  "sus",
  "sus2",
  "sus4",
  "add",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "11",
  "13",
  "madd9",
  "madd",
  "maj7",
  "min7",
  "dim7",
  "aug7",
  "m7",
  "M7",
  "7sus4",
  "m7b5",
  "mMaj7",
  "add9",
  "add2",
  "6/9",
  "m6",
  "maj9",
  "min9",
  "9",
  "sus2",
  "sus4",
  "+",
  "°",
  "ø",
  "Δ",
  "b9",
]);

// Common Italian words that might be mistaken for chords
export const ITALIAN_WORDS_BLACKLIST = new Set([
  "te",
  "mi",
  "si",
  "re",
  "la",
  "del",
  "della",
  "nel",
  "nella",
  "con",
  "per",
  "che",
  "non",
  "una",
  "solo",
  "più",
  "dove",
  "come",
  "quando",
  "ogni",
  "tutto",
  "molto",
  "ancora",
  "anche",
  "a",
  "e",
  "i",
  "o",
]);

export type ChordNotation = "english" | "italian" | "nashville";
export type AccidentalPreference = "sharp" | "flat";
