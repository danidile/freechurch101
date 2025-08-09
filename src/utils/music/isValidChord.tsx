import { ITALIAN_WORDS_BLACKLIST, VALID_CHORD_SUFFIXES } from "./constants";

export function isValidChord(match: string): boolean {
  const lowerMatch = match.toLowerCase();

  // Check if it's in the Italian words blacklist
  if (ITALIAN_WORDS_BLACKLIST.has(lowerMatch)) {
    return false;
  }

  // Parse root, accidental, suffix
  const chordMatch = match.match(
    /^([A-G]|Do|Re|Mi|Fa|Sol|La|Si)([#b♯♭]?)(.*)$/i
  );
  if (!chordMatch) return false;

  const [, root, accidental, suffix] = chordMatch;

  // If there's no suffix, it's valid (single note chord)
  if (!suffix) return true;

  // Normalize for comparison
  const normalizedSuffix = suffix.toLowerCase();

  // Direct match check
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
      (VALID_CHORD_SUFFIXES.has(mainSuffix) ||
        isCompoundSuffixValid(mainSuffix))
    );
  }

  // Allow compound suffixes like m7b5b9, 13b9, maj7#11, etc.
  if (isCompoundSuffixValid(suffix)) {
    return true;
  }

  // Numeric suffix check
  if (/^\d+$/.test(suffix)) {
    const num = parseInt(suffix, 10);
    return num >= 2 && num <= 13;
  }

  return false;
}

/**
 * Checks if a suffix is made up of multiple valid suffix tokens.
 */
function isCompoundSuffixValid(suffix: string): boolean {
  // Match chunks like maj, m, 7, b5, #11, add9, etc.
  const parts =
    suffix
      .match(/(maj|min|dim|aug|sus|add|m|M|\+|°|ø|Δ)?\d*([#b♯♭]\d+)?/g)
      ?.filter(Boolean) || [];

  // Each chunk must be in the valid suffix set or be a numeric/tension extension
  return parts.every(
    (part) =>
      VALID_CHORD_SUFFIXES.has(part) ||
      VALID_CHORD_SUFFIXES.has(part.toLowerCase()) ||
      /^([#b♯♭]?\d+)$/.test(part)
  );
}
