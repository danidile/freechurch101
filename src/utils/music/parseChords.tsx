import {
  AccidentalPreference,
  ChordNotation,
  chordRegex,
  CHROMATIC_SCALE_FLAT,
  CHROMATIC_SCALE_SHARP,
  EN_TO_IT,
  IT_TO_EN,
  ITALIAN_WORDS_BLACKLIST,
  NOTE_TO_SEMITONE,
  ParsedLine,
  SECTION_KEYWORDS,
} from "./constants";
import { isValidChord } from "./isValidChord";
import { convertToNashville } from "./nashville";

function normalizeChord(chord: string): string {
  return chord
    .replace(/°/g, "dim")
    .replace(/ø/g, "m7b5")
    .replace(/\+/g, "aug")
    .replace(/Δ/g, "maj7");
}

function normalizeAccidentals(
  note: string,
  preference: AccidentalPreference
): string {
  const match = note.match(/^([A-Ga-g])([#b♯♭]?)/);
  if (!match) return note;

  const [_, baseNote, accidental] = match;
  let enharmonic = baseNote.toUpperCase();

  // Normalize accidentals to sharp/flat
  const accidentalSymbol =
    accidental === "♯" ? "#" : accidental === "♭" ? "b" : accidental;

  if (accidentalSymbol) enharmonic += accidentalSymbol;

  const semitone = NOTE_TO_SEMITONE[enharmonic];
  if (semitone === undefined) return note; // Invalid note

  const normalized =
    preference === "sharp"
      ? CHROMATIC_SCALE_SHARP[semitone]
      : CHROMATIC_SCALE_FLAT[semitone];

  return note.replace(match[0], normalized);
}

// Improved function to validate if a match is actually a chord

function transposeNote(note: string, semitones: number): string {
  // Normalize semitones to 0-11 range
  semitones = ((semitones % 12) + 12) % 12;
  if (semitones === 0) return note;

  // Parse the note - handle both regular and unicode accidentals
  const match = note.match(/^([A-G])([#b♯♭]?)$/);
  if (!match) {
    return note;
  }

  const [fullMatch, noteName, accidental] = match;

  // Try direct lookup first (for notes like "C#", "Bb")
  let currentSemitone = NOTE_TO_SEMITONE[note];

  if (currentSemitone === undefined) {
    // If direct lookup fails, build it from parts
    currentSemitone = NOTE_TO_SEMITONE[noteName];
    if (currentSemitone === undefined) {
      return note;
    }

    if (accidental === "#" || accidental === "♯") {
      currentSemitone = (currentSemitone + 1) % 12;
    } else if (accidental === "b" || accidental === "♭") {
      currentSemitone = (currentSemitone - 1 + 12) % 12;
    }
  }

  // Calculate new semitone
  const newSemitone = (currentSemitone + semitones) % 12;

  // Choose the best enharmonic spelling based on the original accidental preference
  let result;
  if (accidental === "#" || accidental === "♯") {
    // Prefer sharps if original was sharp
    result = CHROMATIC_SCALE_SHARP[newSemitone];
  } else if (accidental === "b" || accidental === "♭") {
    // Prefer flats if original was flat
    result = CHROMATIC_SCALE_FLAT[newSemitone];
  } else {
    // Original was natural, choose based on direction
    result =
      semitones > 6
        ? CHROMATIC_SCALE_FLAT[newSemitone]
        : CHROMATIC_SCALE_SHARP[newSemitone];
  }

  return result;
}
function toEnglishChord(chord: string): string {
  const normalized = normalizeChord(chord);

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

function convertChordNotation(
  chord: string,
  targetNotation: ChordNotation,
  accidentalPreference: AccidentalPreference = "sharp",
  keyRoot: string = "C"
): string {
  // First normalize the chord to English
  let englishChord = toEnglishChord(chord);

  // Apply accidental preference
  englishChord = normalizeAccidentals(englishChord, accidentalPreference);

  const match = englishChord.match(/^([A-G])([#b♯♭]?)(.*)/);
  if (!match) return chord;

  const [, root, accidental, suffix] = match;

  switch (targetNotation) {
    case "italian":
      const convertedRoot = EN_TO_IT[root] || root;
      return convertedRoot + accidental + suffix;
    case "nashville":
      return convertToNashville(englishChord, keyRoot);
    default:
      return englishChord;
  }
}
function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord;

  const wasItalian = isItalianChord(chord);
  const englishChord = toEnglishChord(chord);

  const slashIndex = englishChord.indexOf("/");
  let main = englishChord;
  let bass = "";

  if (slashIndex !== -1) {
    main = englishChord.slice(0, slashIndex);
    bass = englishChord.slice(slashIndex + 1);
  } else {
  }

  const matchMain = main.match(/^([A-G][#b♯♭]?)(.*)/);

  if (!matchMain) {
    return chord;
  }

  const [, root, suffix] = matchMain;

  const transposedRoot = transposeNote(root, semitones);

  let result = transposedRoot + suffix;

  if (bass) {
    // Only capture the note part for bass, preserve everything else
    const bassMatch = bass.match(/^([A-G][#b♯♭]?)/);

    if (bassMatch) {
      const [, bassRoot] = bassMatch;

      const transposedBass = transposeNote(bassRoot, semitones);

      const bassRemainder = bass.slice(bassRoot.length);

      result += "/" + transposedBass + bassRemainder;
    } else {
      result += "/" + bass;
    }
  }

  const finalResult = toItalianChord(result, wasItalian);

  return finalResult;
}

function transposeChordLine(
  line: string,
  semitones: number,
  notation: ChordNotation = "english",
  accidentalPreference: AccidentalPreference = "sharp",
  keyRoot: string = "C"
): string {
  if (
    semitones === 0 &&
    notation === "english" &&
    accidentalPreference === "sharp"
  )
    return line;

  return line.replace(chordRegex, (match) => {
    // Only process if it's actually a valid chord
    if (!isValidChord(match)) {
      return match; // Return unchanged if not a valid chord
    }

    const transposedChord = transposeChord(match, semitones);
    return convertChordNotation(
      transposedChord,
      notation,
      accidentalPreference,
      keyRoot
    );
  });
}

function isItalianChord(chord: string): boolean {
  return /^(Do|Re|Mi|Fa|Sol|La|Si)\b/i.test(chord);
}
interface ParseOptions {
  transpose?: number;
  preserveEmptyLines?: boolean;
  maxEmptyLines?: number;
  notation?: ChordNotation;
  accidentalPreference?: AccidentalPreference;
  keyRoot?: string;
}
const sectionPatternCache = new Map<string, boolean>();
function analyzeChordLine(line: string): {
  chordMatches: string[];
  words: string[];
  matchRatio: number;
  hasPunctuation: boolean;
  italianChordRatio: number;
  validChordRatio: number;
} {
  const words = line.split(/\s+/).filter((w) => w.length > 0);
  const allMatches = Array.from(line.matchAll(chordRegex)).map((m) => m[0]);
  const validChordMatches = allMatches.filter((match) => isValidChord(match));

  const matchRatio =
    words.length > 0 ? validChordMatches.length / words.length : 0;
  const validChordRatio =
    allMatches.length > 0 ? validChordMatches.length / allMatches.length : 0;

  const hasPunctuation = /[.,;!?].*[a-z]{3,}|[a-z]{3,}.*[.,;!?]/.test(line);

  const italianChords = validChordMatches.filter((match) =>
    isItalianChord(match)
  );
  const italianChordRatio =
    validChordMatches.length > 0
      ? italianChords.length / validChordMatches.length
      : 0;

  return {
    chordMatches: validChordMatches,
    words,
    matchRatio,
    hasPunctuation,
    italianChordRatio,
    validChordRatio,
  };
}

function isChordLine(line: string): boolean {
  const analysis = analyzeChordLine(line);

  // If there are no valid chords found, it's not a chord line.
  if (analysis.chordMatches.length === 0) return false;

  // A chord line must have a high ratio of chord-like words.
  if (analysis.matchRatio < 0.4) return false;

  // Check for common words that are definitely not chords.
  const nonChordWords = analysis.words.filter(
    (word) => !analysis.chordMatches.includes(word)
  );

  // If a significant portion of the line is blacklisted lyrics, it's a lyric line.
  const lyricWordsFound = nonChordWords.filter((word) =>
    ITALIAN_WORDS_BLACKLIST.has(word.toLowerCase())
  );
  if (
    lyricWordsFound.length > 0 &&
    lyricWordsFound.length >= nonChordWords.length * 0.5
  ) {
    return false;
  }

  // If the line contains punctuation, it's likely a lyric line.
  if (analysis.hasPunctuation) return false;

  // A chord line is typically composed of mostly chord words.
  // We can increase the threshold for confidence.
  return analysis.validChordRatio >= 0.7 && analysis.matchRatio >= 0.5;
}
function isSectionLine(line: string): boolean {
  const trimmed = line.trim();

  if (sectionPatternCache.has(trimmed)) {
    return sectionPatternCache.get(trimmed)!;
  }

  const clean = trimmed
    .replace(/^["'\[\(\{]*\s*/, "")
    .replace(/\s*["'\]\)\}]*\s*[:\-–—]*\s*$/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ");

  const isSection = Array.from(SECTION_KEYWORDS).some((keyword) => {
    const pattern = new RegExp(
      `^${keyword.replace(/\s+/g, "\\s+")}\\s*(\\d+)?$`,
      "i"
    );
    return pattern.test(clean);
  });

  sectionPatternCache.set(trimmed, isSection);
  return isSection;
}
export function parseChordSheet(
  input: string,
  options: ParseOptions = {}
): ParsedLine[] {
  const {
    transpose = 0,
    preserveEmptyLines = true,
    maxEmptyLines = 2,
    notation = "english",
    accidentalPreference = "sharp",
    keyRoot = "C",
  } = options;

  if (!input) return [];

  const lines = input.split(/\r?\n/);
  const parsed: ParsedLine[] = [];
  let consecutiveEmptyLines = 0;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (trimmed === "") {
      consecutiveEmptyLines++;
      if (preserveEmptyLines && consecutiveEmptyLines <= maxEmptyLines) {
        parsed.push({ type: "lyrics", text: "" });
      }
      continue;
    }

    consecutiveEmptyLines = 0;

    if (isSectionLine(trimmed)) {
      const cleanSection = trimmed.replace(
        /^["'\[\(\{]*\s*|\s*["'\]\)\}]*\s*[:\-–—]*\s*$/g,
        ""
      );
      parsed.push({ type: "section", text: cleanSection });
      continue;
    }

    // Use rawLine (not trimmed) for chord detection and storage
    if (isChordLine(trimmed)) {
      const transposed = transposeChordLine(
        rawLine, // Use rawLine here to preserve spacing
        transpose,
        notation,
        accidentalPreference,
        keyRoot
      );
      parsed.push({ type: "chords", text: transposed });
      continue;
    }

    // For lyrics, you might want to preserve leading spaces too
    parsed.push({ type: "lyrics", text: rawLine });
  }

  return parsed;
}
