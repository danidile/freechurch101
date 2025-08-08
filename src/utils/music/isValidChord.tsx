import { ITALIAN_WORDS_BLACKLIST, VALID_CHORD_SUFFIXES } from "./constants";

export function isValidChord(match: string): boolean {
  const lowerMatch = match.toLowerCase();

  // Check if it's in the Italian words blacklist
  if (ITALIAN_WORDS_BLACKLIST.has(lowerMatch)) {
    return false;
  }

  // Parse the chord
  const chordMatch = match.match(
    /^([A-G]|Do|Re|Mi|Fa|Sol|La|Si)([#b♯♭]?)(.*)$/i
  );
  if (!chordMatch) return false;

  const [, root, accidental, suffix] = chordMatch;

  // If there's no suffix, it must be a single note (valid chord)
  if (!suffix) return true;

  // Check if suffix is valid
  const normalizedSuffix = suffix.toLowerCase();

  // Check for common valid patterns
  if (
    VALID_CHORD_SUFFIXES.has(suffix) ||
    VALID_CHORD_SUFFIXES.has(normalizedSuffix)
  ) {
    return true;
  }

  // Check for slash chords
  if (suffix.includes("/")) {
    const [mainSuffix, bassPart] = suffix.split("/");
    const bassMatch = bassPart.match(
      /^([A-G]|Do|Re|Mi|Fa|Sol|La|Si)([#b♯♭]?)(.*)$/i
    );
    return (
      bassMatch !== null &&
      (VALID_CHORD_SUFFIXES.has(mainSuffix) || mainSuffix === "")
    );
  }

  // Check for numeric suffixes (7, 9, 11, 13, etc.)
  if (/^\d+$/.test(suffix)) {
    const num = parseInt(suffix);
    return num >= 2 && num <= 13;
  }

  return false;
}
