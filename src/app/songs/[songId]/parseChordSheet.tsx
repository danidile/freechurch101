import { Note, Interval } from "tonal";

const chordRegex =
  /\b((?:[A-G]|Do|Re|Mi|Fa|Sol|La|Si)(?:#|b|♯|♭)?(?:-?|m|maj|min|dim|aug|sus|add|7|9|11|13|m7|maj7|7b5|m9|add9|dim7|maj9|b5|sus4)?(?:\/(?:[A-G]|Do|Re|Mi|Fa|Sol|La|Si)(?:#|b|♯|♭)?)?)\b/gi;

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
  "bridge",

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
  "pre-coro",
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
  // Capitalize only the first letter and lowercase the rest for Italian chords
  const normalizedChord =
    chord.charAt(0).toUpperCase() + chord.slice(1).toLowerCase();

  const match = normalizedChord.match(
    /^(Do|Re|Mi|Fa|Sol|La|Si)([#b♯♭]?)(-?m?)(.*)$/
  );
  if (match) {
    const [, root, accidental, minor, suffix] = match;
    const m = minor === "-" ? "m" : minor;
    return (IT_TO_EN[root] || root) + accidental + m + suffix;
  }
  return chord;
}

function toItalianChord(chord: string, wasItalian: boolean) {
  // Convert root note to uppercase
  const match = chord.match(/^([A-G])([#b♯♭]?)(.*)$/i);
  if (!match) return chord;

  let [, root, accidental, suffix] = match;
  root = root.toUpperCase();

  return (wasItalian ? EN_TO_IT[root] || root : root) + accidental + suffix;
}
function transposeChordLine(line: string, semitones: number): string {
  return line.replace(chordRegex, (chord) => transposeChord(chord, semitones));
}
function isItalianChord(chord: string): boolean {
  return /^(Do|Re|Mi|Fa|Sol|La|Si)/i.test(chord);
}

function transposeChord(chord: string, semitones: number): string {
  const wasItalian = /^(Do|Re|Mi|Fa|Sol|La|Si)/.test(chord);
  const englishChord = toEnglishChord(chord); // normalize input

  const match = englishChord.match(/^([A-G](?:#|b)?)(.*)$/);
  if (!match) return chord;

  const [, root, suffix] = match;

  // Transpose the root note by semitones using tonal Note.transpose
  const interval = Interval.fromSemitones(semitones);
  const transposedRoot = Note.transpose(root, interval);
  if (!transposedRoot) return chord;

  // Convert back to Italian if necessary
  const transposedChord = toItalianChord(transposedRoot + suffix, wasItalian);

  return transposedChord;
}

export function parseChordSheet(
  input: string,
  transpose: number = 0
): ParsedLine[] {
  const lines = input?.split("\n");
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

      const words = trimmed.split(/\s+/);
      const matches = Array.from(trimmed.matchAll(chordRegex));
      const chordLikeWords = matches.map((m) => m[0]);

      const matchRatio = chordLikeWords.length / words.length;
      const punctuation = /[.,;!?]/.test(trimmed);
      const italianChordCount = chordLikeWords.filter(isItalianChord).length;

      const italianLongChordsCount = chordLikeWords.filter(
        (w) => isItalianChord(w) && w.length > 1
      ).length;
      // Tuned heuristic: allow some punctuation, relax ratio, but still require a good portion of longer chords

      if (
        matches.length > 0 &&
        matchRatio > 0.5 &&
        (!punctuation || matchRatio > 0) &&
        (italianChordCount === 0 ||
          italianLongChordsCount >= Math.floor(italianChordCount / 3))
      ) {
        const transposed = transposeChordLine(trimmed, transpose);
        parsed.push({ type: "chords", text: transposed });
        continue;
      }
    }

    parsed.push({ type: "lyrics", text: trimmed });
  }

  return parsed;
}
