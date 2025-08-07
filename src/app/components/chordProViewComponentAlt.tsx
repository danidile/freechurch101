"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { SiSharp } from "react-icons/si";
import { TbWashDryFlat } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { FaPlus, FaMinus } from "react-icons/fa";
import {
  MdDelete,
  MdModeEdit,
  MdMoreVert,
  MdMusicNote,
  MdOutlineTextSnippet,
  MdPiano,
} from "react-icons/md";
import Image from "next/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import ChordSheetJS from "chordsheetjs";

import { JSX, useEffect, useMemo, useState, useCallback } from "react";
import { stepsBetweenKeys } from "@/utils/chordProFunctions/stepsBetweenKey";
import { setListSongT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import isChordProFormat from "./isChordProFormat";
import { useUserStore } from "@/store/useUserStore";
import { deleteSong } from "../songs/[songId]/deleteSongAction";
import Link from "next/link";
import { LuAudioLines } from "react-icons/lu";
import { getAudioFileSongNames } from "@/hooks/GET/getAudioFileSongNames";

// Improved chord sheet parser
import { Note, Interval } from "tonal";
import CDropdown from "./CDropdown";
import { BsMusicNoteList } from "react-icons/bs";
import { RiMusicAiFill } from "react-icons/ri";
// Map semitone distance to Nashville numbers with accidentals
const semitoneToNashville: Record<number, string> = {
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

const chordRegex =
  /\b([A-G]|Do|Re|Mi|Fa|Sol|La|Si)([#b♯♭]?)((?:maj|min|dim|aug|sus|add|m|M|\+|°|ø)?(?:\d+)?(?:[#b♯♭]\d+)?(?:\/(?:[A-G]|Do|Re|Mi|Fa|Sol|La|Si)[#b♯♭]?)?)/gi;
type ParsedLine =
  | { type: "section"; text: string }
  | { type: "chords"; text: string }
  | { type: "lyrics"; text: string };

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
// Notes in semitone order, starting from C
const CHROMATIC_SCALE_SHARP = [
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

const CHROMATIC_SCALE_FLAT = [
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
const NOTE_TO_SEMITONE: Record<string, number> = {
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
type ChordNotation = "english" | "italian" | "nashville";
type AccidentalPreference = "sharp" | "flat";

export function convertToNashville(chord: string, keyRoot: string): string {
  // Parse chord root and suffix
  const match = chord.match(/^([A-Ga-g])([#b♯♭]?)(.*)$/);
  if (!match) return chord;

  let [, root, accidental = "", suffix = ""] = match;

  root = root.toUpperCase();
  accidental = accidental.replace("♯", "#").replace("♭", "b");
  const chordRoot = root + accidental;

  const chordRootIndex = Note.chroma(chordRoot);
  const keyRootIndex = Note.chroma(keyRoot);

  if (chordRootIndex === null || keyRootIndex === null) return chord;

  // Calculate interval from key root
  const interval = (chordRootIndex - keyRootIndex + 12) % 12;
  let numberStr = semitoneToNashville[interval];

  // Detect minor chords
  const isMinor = /^(m|min|\-|minor)/i.test(suffix);
  const cleanSuffix = suffix.replace(/^(m|min|\-|minor)/i, "");

  if (isMinor) {
    numberStr = numberStr.toLowerCase();
  }

  return numberStr + cleanSuffix;
}

const sectionPatternCache = new Map<string, boolean>();

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

function isItalianChord(chord: string): boolean {
  return /^(Do|Re|Mi|Fa|Sol|La|Si)\b/i.test(chord);
}
function transposeNote(note: string, semitones: number): string {
  console.log(`Transposing note: "${note}" by ${semitones} semitones`);

  // Normalize semitones to 0-11 range
  semitones = ((semitones % 12) + 12) % 12;
  if (semitones === 0) return note;

  // Parse the note - handle both regular and unicode accidentals
  const match = note.match(/^([A-G])([#b♯♭]?)$/);
  if (!match) {
    console.log(`No match found for note: "${note}"`);
    return note;
  }

  const [fullMatch, noteName, accidental] = match;
  console.log(
    `Parsed: fullMatch="${fullMatch}", noteName="${noteName}", accidental="${accidental}"`
  );

  // Try direct lookup first (for notes like "C#", "Bb")
  let currentSemitone = NOTE_TO_SEMITONE[note];

  if (currentSemitone === undefined) {
    // If direct lookup fails, build it from parts
    currentSemitone = NOTE_TO_SEMITONE[noteName];
    if (currentSemitone === undefined) {
      console.log(`Unknown note name: "${noteName}"`);
      return note;
    }

    if (accidental === "#" || accidental === "♯") {
      currentSemitone = (currentSemitone + 1) % 12;
    } else if (accidental === "b" || accidental === "♭") {
      currentSemitone = (currentSemitone - 1 + 12) % 12;
    }
  }

  console.log(`Current semitone: ${currentSemitone}`);

  // Calculate new semitone
  const newSemitone = (currentSemitone + semitones) % 12;
  console.log(`New semitone: ${newSemitone}`);

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

  console.log(`Result: "${result}"`);
  return result;
}

function transposeChord(chord: string, semitones: number): string {
  console.log(`=== TRANSPOSE CHORD START ===`);
  console.log(`Input chord: "${chord}"`);
  console.log(`Semitones: ${semitones}`);

  if (semitones === 0) return chord;

  const wasItalian = isItalianChord(chord);
  const englishChord = toEnglishChord(chord);
  console.log(`English chord: "${englishChord}"`);

  const slashIndex = englishChord.indexOf("/");
  let main = englishChord;
  let bass = "";

  if (slashIndex !== -1) {
    main = englishChord.slice(0, slashIndex);
    bass = englishChord.slice(slashIndex + 1);
    console.log(`Split - Main: "${main}", Bass: "${bass}"`);
  } else {
    console.log(`No slash found, treating as simple chord`);
  }

  const matchMain = main.match(/^([A-G][#b♯♭]?)(.*)/);
  console.log(`Main chord match:`, matchMain);

  if (!matchMain) {
    console.log(`Main chord match failed, returning original`);
    return chord;
  }

  const [, root, suffix] = matchMain;
  console.log(`Main - Root: "${root}", Suffix: "${suffix}"`);

  const transposedRoot = transposeNote(root, semitones);
  console.log(`Transposed root: "${transposedRoot}"`);

  let result = transposedRoot + suffix;
  console.log(`Result after main: "${result}"`);

  if (bass) {
    // Only capture the note part for bass, preserve everything else
    const bassMatch = bass.match(/^([A-G][#b♯♭]?)/);
    console.log(`Bass match:`, bassMatch);

    if (bassMatch) {
      const [, bassRoot] = bassMatch;
      console.log(`Bass root: "${bassRoot}"`);

      const transposedBass = transposeNote(bassRoot, semitones);
      console.log(`Transposed bass: "${transposedBass}"`);

      const bassRemainder = bass.slice(bassRoot.length);
      console.log(`Bass remainder: "${bassRemainder}"`);

      result += "/" + transposedBass + bassRemainder;
    } else {
      console.log(`Bass match failed, preserving original bass`);
      result += "/" + bass;
    }
  }

  console.log(`Final result before Italian conversion: "${result}"`);
  const finalResult = toItalianChord(result, wasItalian);
  console.log(`Final result: "${finalResult}"`);
  console.log(`=== TRANSPOSE CHORD END ===`);

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
    const transposedChord = transposeChord(match, semitones);
    return convertChordNotation(
      transposedChord,
      notation,
      accidentalPreference,
      keyRoot
    );
  });
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

  if (analysis.chordMatches.length === 0) return false;
  if (analysis.matchRatio >= 0.7) return true;
  if (analysis.matchRatio >= 0.5 && !analysis.hasPunctuation) return true;
  if (analysis.words.length === 1 && analysis.matchRatio === 1) return true;
  if (analysis.chordMatches.length >= 2 && analysis.matchRatio >= 0.4)
    return true;

  return false;
}

interface ParseOptions {
  transpose?: number;
  preserveEmptyLines?: boolean;
  maxEmptyLines?: number;
  notation?: ChordNotation;
  accidentalPreference?: AccidentalPreference;
  keyRoot?: string;
}

function parseChordSheet(
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

    if (isChordLine(trimmed)) {
      const transposed = transposeChordLine(
        trimmed,
        transpose,
        notation,
        accidentalPreference,
        keyRoot
      );
      parsed.push({ type: "chords", text: transposed });
      continue;
    }

    parsed.push({ type: "lyrics", text: trimmed });
  }

  return parsed;
}

export default function ChordProViewComponent({
  setListSong,
  mode,
}: {
  setListSong: setListSongT;
  mode?: string;
}) {
  console.log(setListSong.lyrics);
  const pathname = usePathname();
  const { userData } = useUserStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Check if uses chordpro format
  const [isChordPro, setIsChordPro] = useState(false);
  const [audioPaths, setAudioPaths] = useState<string[]>([]);
  const [viewChords, setViewChords] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [chordNotation, setChordNotation] = useState<ChordNotation>("english");
  const [accidentalPreference, setAccidentalPreference] =
    useState<AccidentalPreference>("sharp");

  // Improved transpose state management
  const [transpose, setTranspose] = useState(() =>
    stepsBetweenKeys(setListSong.upload_key!, setListSong.key!)
  );

  // ChordPro specific states
  const [chordProState, setChordProState] = useState("");
  const [chordProCount, setChordProCount] = useState(0);
  const [songKey, setSongKey] = useState(
    setListSong.key || setListSong.upload_key
  );

  const keys = [
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

  // Initialize ChordPro parsing
  const { chordProSong, chordProFormatter } = useMemo(() => {
    if (!setListSong.lyrics)
      return { chordProSong: null, chordProFormatter: null };

    const parser = new ChordSheetJS.ChordProParser();
    let song = parser.parse(setListSong.lyrics);
    const steps = stepsBetweenKeys(setListSong.upload_key, setListSong.key);
    song = song.transpose(steps);
    const formatter = new ChordSheetJS.HtmlTableFormatter();

    return { chordProSong: song, chordProFormatter: formatter };
  }, [setListSong.lyrics, setListSong.upload_key, setListSong.key]);

  // Parse lyrics with improved parser
  const parsedLyrics = useMemo(() => {
    if (!setListSong.lyrics || isChordPro) return [];

    const originalKey = setListSong.upload_key || setListSong.key || "C";
    const currentKey = setListSong.key || setListSong.upload_key || "C";

    // For Nashville system, always use original lyrics without transpose
    // For other notations, apply transpose
    const transposeAmount = chordNotation === "nashville" ? 0 : transpose;
    const keyForNashville =
      chordNotation === "nashville" ? originalKey : currentKey;

    return parseChordSheet(setListSong.lyrics, {
      transpose: transposeAmount,
      preserveEmptyLines: true,
      maxEmptyLines: 2,
      notation: chordNotation,
      accidentalPreference,
      keyRoot: keyForNashville,
    });
  }, [
    setListSong.lyrics,
    transpose,
    isChordPro,
    chordNotation,
    accidentalPreference,
    setListSong.key,
    setListSong.upload_key,
  ]);
  // Check ChordPro format
  useEffect(() => {
    setIsChordPro(isChordProFormat(setListSong.lyrics));
  }, [setListSong.lyrics]);

  // Initialize ChordPro display
  useEffect(() => {
    if (isChordPro && chordProSong && chordProFormatter) {
      const display = chordProFormatter.format(chordProSong);
      setChordProState(display);
    }
  }, [isChordPro, chordProSong, chordProFormatter]);

  // Load audio files
  useEffect(() => {
    if (setListSong.audio_path && userData?.church_id) {
      const folderPath = `${userData.church_id}/music/audio/${setListSong.id}`;
      getAudioFileSongNames("churchdata", folderPath).then((names) => {
        console.log("Files in folder:", names);
        setAudioPaths(names);
      });
    }
  }, [setListSong.audio_path, setListSong.id, userData?.church_id]);

  // Event handlers
  const toggleView = useCallback(() => {
    setViewChords((v) => !v);
  }, []);

  const changeTranspose = useCallback((delta: number) => {
    setTranspose((prev) => Math.max(-12, Math.min(12, prev + delta)));
  }, []);

  const toggleAccidentals = useCallback(() => {
    setAccidentalPreference((prev) => (prev === "sharp" ? "flat" : "sharp"));
  }, []);

  const transposeUp = useCallback(() => {
    if (!chordProSong || !chordProFormatter) return;

    setChordProCount((prevCount) => {
      const newCount = prevCount + 1;
      const newChords = chordProSong.transpose(newCount);
      const display = chordProFormatter.format(newChords);
      setChordProState(display);
      return newCount;
    });

    setSongKey((prevKey) => {
      const currentIndex = keys.findIndex((key) => key === prevKey);
      return keys[(currentIndex + 1) % keys.length];
    });
  }, [chordProSong, chordProFormatter, keys]);

  const transposeDown = useCallback(() => {
    if (!chordProSong || !chordProFormatter) return;

    setChordProCount((prevCount) => {
      const newCount = prevCount - 1;
      const newChords = chordProSong.transpose(newCount);
      const display = chordProFormatter.format(newChords);
      setChordProState(display);
      return newCount;
    });

    setSongKey((prevKey) => {
      const currentIndex = keys.findIndex((key) => key === prevKey);
      return keys[(currentIndex - 1 + keys.length) % keys.length];
    });
  }, [chordProSong, chordProFormatter, keys]);

  const handleTransposeUp = useCallback(() => {
    changeTranspose(1);
    if (isChordPro) {
      transposeUp();
    }
  }, [changeTranspose, transposeUp, isChordPro]);

  const handleTransposeDown = useCallback(() => {
    changeTranspose(-1);
    if (isChordPro) {
      transposeDown();
    }
  }, [changeTranspose, transposeDown, isChordPro]);

  const renderParsedLyrics = useCallback(() => {
    return parsedLyrics.flatMap((line, i) => {
      const lines: JSX.Element[] = [];

      // Handle custom section tags
      if (line.text.includes("<section>") && line.text.includes("</section>")) {
        const match = line.text.match(/<section>(.*?)<\/section>(.*)/);
        if (match) {
          const commentText = match[1].trim();
          const restText = match[2].trim();

          lines.push(
            <p key={`comment-${i}`} className="comment">
              <b>{commentText}</b>
            </p>
          );

          if (restText) {
            lines.push(
              <p key={`chords-after-${i}`} className="chord">
                {restText}
              </p>
            );
          }

          return lines;
        }
      }

      // Handle split section tags
      if (line.text.includes("<section>") || line.text.includes("</section>")) {
        if (line.text.includes("<section>")) {
          const match = line.text.match(/<section>(.*)/);
          if (match) {
            const commentText = match[1].trim();
            lines.push(
              <p key={`comment-${i}`} className="comment">
                <b>{commentText}</b>
              </p>
            );
            return lines;
          }
        } else if (line.text.includes("</section>")) {
          const match = line.text.match(/(.*)<\/section>(.*)/);
          if (match) {
            const commentText = match[1].trim();
            const restText = match[2].trim();

            lines.push(
              <p key={`comment-${i}`} className="comment">
                <b>{commentText}</b>
              </p>
            );

            if (restText) {
              lines.push(
                <p key={`chords-after-${i}`} className="chord">
                  {restText}
                </p>
              );
            }

            return lines;
          }
        }
      }

      // Handle different line types
      switch (line.type) {
        case "section":
          lines.push(
            <p key={`section-${i}`} className="comment">
              <b>{line.text}</b>
            </p>
          );
          break;
        case "chords":
          if (viewChords) {
            lines.push(
              <p key={`chords-${i}`} className="chord">
                {line.text}
              </p>
            );
          }
          break;
        case "lyrics":
          lines.push(
            <p key={`lyrics-${i}`} className="lyrics">
              {line.text}
            </p>
          );
          break;
      }

      return lines;
    });
  }, [parsedLyrics, viewChords]);
  const notationOptions = useMemo(() => {
    const allOptions = [
      {
        label: (
          <div
            className={`${viewChords ? "opacity-100" : "opacity-0"} transopose-section`}
            onMouseDown={(e) => e.stopPropagation()} // ✅ Prevent dropdown from closing
          >
            <p className="font-medium">Tonalità:</p>
            <button
              onMouseDown={(e) => e.stopPropagation()} // ✅ Prevent dropdown from closing
              type="button"
              className="icon-button"
              onClick={(e) => {
                e.stopPropagation(); // ✅ Stop bubbling
                handleTransposeDown();
              }}
            >
              <FaMinus />
            </button>
            <button
              onMouseDown={(e) => e.stopPropagation()} // ✅ Prevent dropdown from closing
              type="button"
              className="icon-button"
              onClick={(e) => {
                e.stopPropagation(); // ✅ Stop bubbling
                handleTransposeUp();
              }}
            >
              <FaPlus />
            </button>
          </div>
        ),
        value: "transpose",
      },
      {
        label: (
          <p className="hover:text-blue-500 transition duration-200">
            <span className="font-medium">Inglese</span> -{" "}
            <small>(A , B , C)</small>
          </p>
        ),
        value: "english",
      },
      {
        label: (
          <p className="hover:text-blue-500 transition duration-200">
            <span className="font-medium">Italiano</span>
            <small> - (Do , Re , Mi)</small>
          </p>
        ),
        value: "italian",
      },
      {
        label: (
          <p className="hover:text-blue-500 transition duration-200">
            <span className="font-medium">Nashville</span> -{" "}
            <small>(1 , 2 , 3)</small>
          </p>
        ),
        value: "nashville",
      },
      {
        label: (
          <p className="hover:text-blue-500 transition duration-200">
            <span className="font-medium">Solo Testo</span>
          </p>
        ),
        value: "lyrics",
      },
      {
        label: (
          <p className="hover:text-blue-500 transition duration-200">
            <span className="font-medium">Con Accordi</span>
          </p>
        ),
        value: "chords",
      },
      {
        label: (
          <p className="hover:text-blue-500 transition duration-200">
            <span className="font-medium">Converti # in b</span>
          </p>
        ),
        value: "sharp-flat",
      },
    ];

    return allOptions.filter((option) => {
      if (viewChords && option.value === "lyrics") return true;
      if (viewChords && option.value === "chords") return false;
      if (!viewChords && option.value === "lyrics") return false;
      if (!viewChords && option.value === "chords") return true;

      if (
        (["english", "italian", "nashville"].includes(chordNotation) &&
          !viewChords) ||
        (["english", "italian", "nashville"].includes(chordNotation) &&
          option.value === chordNotation)
      ) {
        return false;
      }

      return true;
    });
  }, [viewChords, chordNotation]);
  return (
    <div className="relative">
      {mode !== "preview" && (
        <div className="view-selector-container">
          {audioPaths.length >= 1 && (
            <Button
              isIconOnly
              onPress={() => setShowPlayer((prev) => !prev)}
              variant="flat"
            >
              <LuAudioLines />
            </Button>
          )}
          {userData && hasPermission(userData.role as Role, "update:songs") && (
            <CDropdown
              options={[
                {
                  label: "Aggiorna",
                  value: "update",
                  href: `/${pathname.split("/")[1]}/${setListSong.id}/update`,
                },
                {
                  label: "Elimina",
                  value: "delete",
                  color: "danger",
                },
              ]}
              buttonPadding="sm"
              positionOnMobile="right"
              placeholder={<MdMoreVert size={22} />}
              onSelect={(option) => {
                if (option.value === "delete") {
                  onOpen();
                }
              }}
            />
          )}

          <CDropdown
            options={notationOptions}
            buttonPadding="sm"
            positionOnDesktop="right"
            positionOnMobile="right"
            placeholder={<RiMusicAiFill size={20} />}
            onSelect={(option) => {
              if (
                option.value === "nashville" ||
                option.value === "italian" ||
                option.value === "english"
              ) {
                setChordNotation(option.value as ChordNotation);
              } else if (
                option.value === "chords" ||
                option.value === "lyrics"
              ) {
                toggleView();
              } else if (option.value === "sharp-flat") {
                toggleAccidentals();
              }
            }}
          />
        </div>
      )}

      {showPlayer && (
        <div className="max-w-2xl mx-auto space-y-1 my-3">
          {audioPaths.map((path, index) => {
            const trackName = path
              .replace(/\.[^/.]+$/, "")
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

            return (
              <div
                key={index}
                className="my-2 border border-gray-100 rounded p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="overflow-hidden line-clamp-1 text-sm text-gray-600">
                    {trackName}
                  </p>
                </div>
                <audio controls className="w-full h-8">
                  <source
                    src={`https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/churchdata/${userData?.church_id}/music/audio/${setListSong.id}/${path}`}
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <h5 className="song-title">{setListSong.song_title}</h5>
        <div className="flex flex-col gap-1 mt-2">
          <small>{setListSong.author}</small>
          <small>
            Tonalità: {songKey} - BPM: {setListSong?.bpm} - Tempo:{" "}
            {setListSong?.time_signature}
          </small>
        </div>

        {!isChordPro && renderParsedLyrics()}

        {isChordPro && (
          <>
            {viewChords && (
              <>
                <div
                  id="song-chords"
                  dangerouslySetInnerHTML={{ __html: chordProState }}
                  style={{ whiteSpace: "pre-wrap" }}
                />
              </>
            )}
            {!viewChords && (
              <div
                id="song-lyrics"
                dangerouslySetInnerHTML={{ __html: chordProState }}
                style={{ whiteSpace: "pre-wrap" }}
              />
            )}
          </>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Elimina Evento
              </ModalHeader>
              <ModalBody>
                <p>
                  <span className="underline">
                    Sei sicuro di voler eliminare questa Canzone
                  </span>{" "}
                  Eliminerai tutti i dati relativi a questa canzone. Se sì
                  clicca su <strong>"Elimina"</strong> altrimenti clicca su
                  cancella.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button fullWidth color="primary" onPress={onClose}>
                  Cancella
                </Button>
                <Button
                  fullWidth
                  color="danger"
                  onPress={() => deleteSong(setListSong.id)}
                >
                  Elimina
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
