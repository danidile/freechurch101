import { NOTE_TO_SEMITONE, semitoneToNashville } from "./constants";

export function convertToNashville(chord: string, keyRoot: string): string {
  // Check if it's a slash chord
  const slashIndex = chord.indexOf("/");
  let mainChord = chord;
  let bassNote = "";

  if (slashIndex !== -1) {
    mainChord = chord.slice(0, slashIndex);
    bassNote = chord.slice(slashIndex + 1);
  }

  // Parse main chord root and suffix
  const match = mainChord.match(/^([A-Ga-g])([#b♯♭]?)(.*)$/);
  if (!match) return chord;

  let [, root, accidental = "", suffix = ""] = match;

  root = root.toUpperCase();
  accidental = accidental.replace("♯", "#").replace("♭", "b");
  const chordRoot = root + accidental;

  const chordRootIndex = NOTE_TO_SEMITONE[chordRoot];
  const keyRootIndex = NOTE_TO_SEMITONE[keyRoot];

  if (chordRootIndex === undefined || keyRootIndex === undefined) return chord;

  // Calculate interval from key root
  const interval = (chordRootIndex - keyRootIndex + 12) % 12;
  let numberStr = semitoneToNashville[interval];

  // Detect minor chords
  const isMinor = /^(m|min|\-|minor)/i.test(suffix);
  const cleanSuffix = suffix.replace(/^(m|min|\-|minor)/i, "");

  if (isMinor) {
    numberStr = numberStr.toLowerCase();
  }

  let result = numberStr + cleanSuffix;

  // Handle bass note conversion
  if (bassNote) {
    const bassMatch = bassNote.match(/^([A-Ga-g])([#b♯♭]?)(.*)$/);
    if (bassMatch) {
      let [, bassRoot, bassAccidental = "", bassRemainder = ""] = bassMatch;

      bassRoot = bassRoot.toUpperCase();
      bassAccidental = bassAccidental.replace("♯", "#").replace("♭", "b");
      const bassNoteRoot = bassRoot + bassAccidental;

      const bassRootIndex = NOTE_TO_SEMITONE[bassNoteRoot];
      if (bassRootIndex !== undefined) {
        const bassInterval = (bassRootIndex - keyRootIndex + 12) % 12;
        const bassNumberStr = semitoneToNashville[bassInterval];
        result += "/" + bassNumberStr + bassRemainder;
      } else {
        // If bass note can't be converted, keep original
        result += "/" + bassNote;
      }
    } else {
      // If bass note can't be parsed, keep original
      result += "/" + bassNote;
    }
  }

  return result;
}
