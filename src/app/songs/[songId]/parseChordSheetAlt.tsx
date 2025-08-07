import { Note, Interval } from "tonal";

// More comprehensive chord regex with better capture groups
const chordRegex =
  /\b([A-G]|Do|Re|Mi|Fa|Sol|La|Si)([#b♯♭]?)((?:maj|min|dim|aug|sus|add|m|M|\+|°|ø)?(?:\d+)?(?:[#b♯♭]\d+)?(?:\/(?:[A-G]|Do|Re|Mi|Fa|Sol|La|Si)[#b♯♭]?)?)\b/gi;

type ParsedLine =
  | { type: "section"; text: string }
  | { type: "chords"; text: string }
  | { type: "lyrics"; text: string };

// Organized and deduplicated section keywords
const SECTION_KEYWORDS = new Set([
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

// Note mappings
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

// Cached regex for performance
const sectionPatternCache = new Map<string, boolean>();

function isSectionLine(line: string): boolean {
  const trimmed = line.trim();

  // Check cache first
  if (sectionPatternCache.has(trimmed)) {
    return sectionPatternCache.get(trimmed)!;
  }

  // Remove common wrappers and normalize
  const clean = trimmed
    .replace(/^["'\[\(\{]*\s*/, "")
    .replace(/\s*["'\]\)\}]*\s*[:\-–—]*\s*$/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ");

  // Check if it matches any section keyword (with optional numbers)
  const isSection = Array.from(SECTION_KEYWORDS).some((keyword) => {
    const pattern = new RegExp(
      `^${keyword.replace(/\s+/g, "\\s+")}\\s*(\\d+)?$`,
      "i"
    );
    return pattern.test(clean);
  });

  // Cache result
  sectionPatternCache.set(trimmed, isSection);
  return isSection;
}

function normalizeChord(chord: string): string {
  // Handle common chord notation variations
  return chord
    .replace(/°/g, "dim")
    .replace(/ø/g, "m7b5")
    .replace(/\+/g, "aug")
    .replace(/Δ/g, "maj7");
}

function toEnglishChord(chord: string): string {
  const normalized = normalizeChord(chord);

  // More precise regex for Italian chord parsing
  const match = normalized.match(/^(Do|Re|Mi|Fa|Sol|La|Si)([#b♯♭]?)(.*)/i);
  if (!match) return normalized;

  const [, root, accidental, suffix] = match;
  const englishRoot =
    IT_TO_EN[root.charAt(0).toUpperCase() + root.slice(1).toLowerCase()];

  return englishRoot ? englishRoot + accidental + suffix : normalized;
}

function toItalianChord(chord: string, wasItalian: boolean): string {
  if (!wasItalian) return chord;

  const match = chord.match(/^([A-G])([#b♯♭]?)(.*)/);
  if (!match) return chord;

  const [, root, accidental, suffix] = match;
  const italianRoot = EN_TO_IT[root.toUpperCase()];

  return italianRoot ? italianRoot + accidental + suffix : chord;
}

function isItalianChord(chord: string): boolean {
  return /^(Do|Re|Mi|Fa|Sol|La|Si)\b/i.test(chord);
}

function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord;

  const wasItalian = isItalianChord(chord);
  const englishChord = toEnglishChord(chord);

  const match = englishChord.match(/^([A-G][#b♯♭]?)(.*)/);
  if (!match) return chord;

  const [, root, suffix] = match;

  try {
    const interval = Interval.fromSemitones(semitones);
    const transposedRoot = Note.transpose(root, interval);

    if (!transposedRoot) return chord;

    const result = transposedRoot + suffix;
    return toItalianChord(result, wasItalian);
  } catch (error) {
    console.warn(`Failed to transpose chord ${chord}:`, error);
    return chord;
  }
}

function transposeChordLine(line: string, semitones: number): string {
  if (semitones === 0) return line;

  return line.replace(chordRegex, (match) => transposeChord(match, semitones));
}

function analyzeChordLine(line: string): {
  chordMatches: RegExpMatchArray[];
  words: string[];
  matchRatio: number;
  hasPunctuation: boolean;
  italianChordRatio: number;
} {
  const words = line.split(/\s+/).filter((w) => w.length > 0);
  const chordMatches = Array.from(line.matchAll(chordRegex));
  const matchRatio = words.length > 0 ? chordMatches.length / words.length : 0;

  // Check for sentence-like punctuation
  const hasPunctuation = /[.,;!?].*[a-z]{3,}|[a-z]{3,}.*[.,;!?]/.test(line);

  const italianChords = chordMatches.filter((match) =>
    isItalianChord(match[0])
  );
  const italianChordRatio =
    chordMatches.length > 0 ? italianChords.length / chordMatches.length : 0;

  return { chordMatches, words, matchRatio, hasPunctuation, italianChordRatio };
}

function isChordLine(line: string): boolean {
  const analysis = analyzeChordLine(line);

  // Must have at least one chord match
  if (analysis.chordMatches.length === 0) return false;

  // High ratio of chord-like words
  if (analysis.matchRatio >= 0.7) return true;

  // Medium ratio with no sentence-like punctuation
  if (analysis.matchRatio >= 0.5 && !analysis.hasPunctuation) return true;

  // Special case: single chord on a line
  if (analysis.words.length === 1 && analysis.matchRatio === 1) return true;

  // Lines with multiple chords and minimal text
  if (analysis.chordMatches.length >= 2 && analysis.matchRatio >= 0.4)
    return true;

  return false;
}

export interface ParseOptions {
  transpose?: number;
  preserveEmptyLines?: boolean;
  maxEmptyLines?: number;
}

export function parseChordSheetAlt(
  input: string,
  options: ParseOptions = {}
): ParsedLine[] {
  const {
    transpose = 0,
    preserveEmptyLines = true,
    maxEmptyLines = 2,
  } = options;

  if (!input) return [];

  const lines = input.split(/\r?\n/); // Handle different line endings
  const parsed: ParsedLine[] = [];
  let consecutiveEmptyLines = 0;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    // Handle empty lines
    if (trimmed === "") {
      consecutiveEmptyLines++;
      if (preserveEmptyLines && consecutiveEmptyLines <= maxEmptyLines) {
        parsed.push({ type: "lyrics", text: "" });
      }
      continue;
    }

    consecutiveEmptyLines = 0;

    // Check for section headers
    if (isSectionLine(trimmed)) {
      const cleanSection = trimmed.replace(
        /^["'\[\(\{]*\s*|\s*["'\]\)\}]*\s*[:\-–—]*\s*$/g,
        ""
      );
      parsed.push({ type: "section", text: cleanSection });
      continue;
    }

    // Check for chord lines
    if (isChordLine(trimmed)) {
      const transposed = transposeChordLine(trimmed, transpose);
      parsed.push({ type: "chords", text: transposed });
      continue;
    }

    // Default to lyrics
    parsed.push({ type: "lyrics", text: trimmed });
  }

  return parsed;
}

// Utility function to get chord progression from parsed lines
export function extractChordProgressions(parsedLines: ParsedLine[]): string[] {
  return parsedLines
    .filter((line) => line.type === "chords")
    .map((line) => line.text);
}

// Utility function to detect key signature
export function detectKey(parsedLines: ParsedLine[]): string | null {
  const chordLines = extractChordProgressions(parsedLines);
  const allChords = chordLines.join(" ").match(chordRegex) || [];

  if (allChords.length === 0) return null;

  // Simple key detection based on most common chord
  const chordCounts = allChords.reduce(
    (acc, chord) => {
      const root = chord.match(/^[A-G]|Do|Re|Mi|Fa|Sol|La|Si/)?.[0];
      if (root) {
        acc[root] = (acc[root] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const mostCommon = Object.entries(chordCounts).sort(
    ([, a], [, b]) => b - a
  )[0];

  return mostCommon ? mostCommon[0] : null;
}
