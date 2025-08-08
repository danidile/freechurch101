"use client";

import ChordSheetJS from "chordsheetjs";
import { JSX, useEffect, useMemo, useState, useCallback } from "react";
import { stepsBetweenKeys } from "@/utils/chordProFunctions/stepsBetweenKey";
import { setListSongT } from "@/utils/types/types";
import isChordProFormat from "./isChordProFormat";
import { useUserStore } from "@/store/useUserStore";
import { deleteSong } from "../songs/[songId]/deleteSongAction";
import { getAudioFileSongNames } from "@/hooks/GET/getAudioFileSongNames";
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
  // Common patterns
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
      `^${keyword.replace(/\s+/g, "\\s+")}(\\s*\\d*)?$`,
      "i"
    );
    return pattern.test(clean);
  });

  sectionPatternCache.set(trimmed, isSection);
  return isSection;
}

interface ParseOptions {
  preserveEmptyLines?: boolean;
  maxEmptyLines?: number;
}

type ParsedLine =
  | { type: "section"; text: string }
  | { type: "lyrics"; text: string };

function parseChordSheet(
  input: string,
  options: ParseOptions = {}
): ParsedLine[] {
  const { preserveEmptyLines = true, maxEmptyLines = 2 } = options;

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
    } else {
      parsed.push({ type: "lyrics", text: trimmed });
    }
  }

  return parsed;
}

export default function ArrangementCreator({
  setListSong,
}: {
  setListSong: setListSongT;
}) {
  // Check if uses chordpro format
  const [isChordPro, setIsChordPro] = useState(false);
  const [viewChords, setViewChords] = useState(true);

  // Improved transpose state management
  const [transpose, setTranspose] = useState(() =>
    stepsBetweenKeys(setListSong.upload_key!, setListSong.key!)
  );

  // ChordPro specific states
  const [chordProState, setChordProState] = useState("");
  const [allSections, setAllSections] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

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

    return parseChordSheet(setListSong.lyrics, {
      preserveEmptyLines: true,
      maxEmptyLines: 2,
    });
  }, [
    setListSong.lyrics,
    transpose,
    isChordPro,
    setListSong.key,
    setListSong.upload_key,
  ]);
  useEffect(() => {
    const uniqueSections = Array.from(
      new Set(
        parsedLyrics
          .filter((line) => line.type === "section")
          .map((line) => line.text.trim())
      )
    );
    setAllSections(uniqueSections);
  }, [parsedLyrics]);
  const handleAddSection = (section: string) => {
    setSelectedSections((prev) => [...prev, section]);
  };
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
      }

      return lines;
    });
  }, [parsedLyrics, viewChords]);

  return (
    <div className="relative">
      <div>
        <h5 className="song-title">{setListSong.song_title}</h5>

        {allSections.length > 0 && (
          <div className="my-4">
            <h4 className="font-bold mb-2">Crea Arrangiamento:</h4>
            <div className="flex flex-wrap gap-2">
              {allSections.map((section) => (
                <button
                  key={section}
                  onClick={() => handleAddSection(section)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  + {section}
                </button>
              ))}
            </div>
          </div>
        )}
        {selectedSections.length > 0 && (
          <div className="mt-4">
            <h4 className="font-bold mb-2">Struttura Arrangiamento:</h4>
            <ul className="list-disc list-inside">
              {selectedSections.map((section, i) => (
                <li key={`selected-${i}`}>{section}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
