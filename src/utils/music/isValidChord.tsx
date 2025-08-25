import { VALID_CHORD_SUFFIXES } from "./constants";

export function isValidChord(match: string): boolean {
  // Parse root, accidental, suffix
  const chordMatch = match.match(
    /^([A-G]|Do|Re|Mi|Fa|Sol|La|Si)([#b♯♭]?)(maj|min|dim|aug|sus|add|m|M|\+|°|ø|Δ)?(\d{0,2})?([#b♯♭]?\d{0,2})?(\/([A-G]|Do|Re|Mi|Fa|Sol|La|Si)([#b♯♭]?))?$/i
  );
  if (!chordMatch) return false;

  const [, root, accidental, suffix] = chordMatch;
  if (suffix?.includes(" ")) {
    return false;
  }
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
/**
 * Checks if a suffix is made up of multiple valid suffix tokens.
 */
function isCompoundSuffixValid(suffix: string): boolean {
  // Trim the suffix to handle leading/trailing spaces
  const trimmedSuffix = suffix.trim();

  // If the suffix is empty after trimming, it's not a valid compound suffix
  if (!trimmedSuffix) {
    return false;
  }

  const parts =
    trimmedSuffix
      .match(/(maj|min|dim|aug|sus|add|m|M|\+|°|ø|Δ)?\d*([#b♯♭]\d+)?/g)
      ?.filter(Boolean) || [];

  // Check if no parts were found, which indicates an invalid suffix
  if (parts.length === 0) {
    return false;
  }

  // Each chunk must be in the valid suffix set or be a numeric/tension extension
  return parts.every(
    (part) =>
      VALID_CHORD_SUFFIXES.has(part) ||
      VALID_CHORD_SUFFIXES.has(part.toLowerCase()) ||
      /^([#b♯♭]?\d+)$/.test(part)
  );
}
