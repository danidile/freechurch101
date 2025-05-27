const chordRegex = /\b((?:[A-G]|Do|Re|Mi|Fa|Sol|La|Si)(?:#|b)?(?:-?|m|maj|min|dim|aug|sus|add|7|9|11|13|m7|maj7|7b5|m9|add9|dim7|maj9|b5|sus4)?(?:\/(?:[A-G]|Do|Re|Mi|Fa|Sol|La|Si)(?:#|b)?)?)\b/gi;

type ParsedLine =
  | { type: "section"; text: string }
  | { type: "chords"; text: string }
  | { type: "lyrics"; text: string };

const sectionKeywords = [
  // English
  "intro",
  "verse",
  "chorus",
  "pre-chorus",
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

  // Italian
  "intro",
  "strofa",
  "ritornello",
  "pre-ritornello",
  "ponte",
  "coro",
  "interludio",
  "strumentale",
  "finale",
  "coda",
  "verso",
  "ripresa",
  "special",
  "assolo",
];

const IT_TO_EN: Record<string, string> = {
  Do: "C",
  Re: "D",
  Mi: "E",
  Fa: "F",
  Sol: "G",
  La: "A",
  Si: "B",
};

const EN_TO_IT: Record<string, string> = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};

const FLAT_EQUIVALENTS: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

const CHORDS = [
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
function isSectionLine(line: string): boolean {
  const trimmed = line.trim();

  // Remove common wrappers: brackets, quotes, parentheses
  const clean = trimmed
    .replace(/^["'\[\(\{]*\s*/, "") // remove opening [, ", ', (, {
    .replace(/\s*["'\]\)\}]*$/, "") // remove closing ], ", ', ), }

    .toLowerCase();

  // Pattern for keywords with optional number and optional punctuation after
  return sectionKeywords.some((kw) => {
    const pattern = `^${kw}(\\s*\\d*)?\\s*[:\\-–—]?\\s*$`;
    const regex = new RegExp(pattern);
    return regex.test(clean);
  });
}

function toEnglishChord(chord: string) {
  const match = chord.match(/^(Do|Re|Mi|Fa|Sol|La|Si)([#b]?)([-m]?)(.*)$/);
  if (match) {
    const [, root, accidental, minor, suffix] = match;
    const m = minor === "-" ? "m" : minor;
    return (IT_TO_EN[root] || root) + accidental + m + suffix;
  }
  return chord;
}

function toItalianChord(chord: string, wasItalian: boolean) {
  const match = chord.match(/^([A-G])([#b]?)(.*)$/);
  if (!match) return chord;
  const [, root, accidental, suffix] = match;
  return (wasItalian ? EN_TO_IT[root] || root : root) + accidental + suffix;
}

function transposeChord(chord: string, semitones: number): string {
  const wasItalian = /^(Do|Re|Mi|Fa|Sol|La|Si)/.test(chord);
  const english = toEnglishChord(chord);

  const match = english.match(/^([A-G][b#]?)(.*)$/);
  if (!match) return chord;

  let [_, root, suffix] = match;
  root = FLAT_EQUIVALENTS[root] || root;
  const index = CHORDS.indexOf(root);
  if (index === -1) return chord;

  const newRoot = CHORDS[(index + semitones + CHORDS.length) % CHORDS.length];
  return toItalianChord(newRoot + suffix, wasItalian);
}
function transposeChordLine(line: string, semitones: number): string {
  return line.replace(
    /\b(?:Do|Re|Mi|Fa|Sol|La|Si|[A-G])[#b]?(?:m|maj|min|dim|aug|sus|add|7|9|11|13)?\b/g,
    (chord) => transposeChord(chord, semitones)
  );
}
export function parseChordSheet(
  input: string,
  transpose: number = 0
): ParsedLine[] {
  const lines = input.split("\n");
  const parsed: ParsedLine[] = [];

  let emptyLineCount = 0;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (trimmed === "") {
      emptyLineCount++;
      if (emptyLineCount <= 2) {
        parsed.push({ type: "lyrics", text: "" });
      }
      continue;
    }

    emptyLineCount = 0;

    if (isSectionLine(trimmed)) {
      const clean = trimmed.replace(/^\[|\]$/g, "").trim();
      parsed.push({ type: "section", text: clean });
      continue;
    }

    if (chordRegex.test(trimmed)) {
      chordRegex.lastIndex = 0;

      const matches = Array.from(trimmed.matchAll(chordRegex));
      const matchRatio = matches.length / trimmed.split(/\s+/).length;

      if (matches.length > 0 && matchRatio > 0.25) {
        const transposed = transposeChordLine(trimmed, transpose);
        parsed.push({ type: "chords", text: transposed });
        continue;
      }
    }

    parsed.push({ type: "lyrics", text: trimmed });
  }

  return parsed;
}
