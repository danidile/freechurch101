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

import { usePathname } from "next/navigation";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";

import ChordSheetJS from "chordsheetjs";
import { JSX, useEffect, useMemo, useState, useCallback } from "react";
import { stepsBetweenKeys } from "@/utils/chordProFunctions/stepsBetweenKey";
import { setListSongT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import isChordProFormat from "./isChordProFormat";
import { useUserStore } from "@/store/useUserStore";
import { deleteSong } from "../songs/[songId]/deleteSongAction";
import { LuAudioLines } from "react-icons/lu";
import { getAudioFileSongNames } from "@/hooks/GET/getAudioFileSongNames";

// Improved chord sheet parser
import CDropdown from "./CDropdown";
import { RiMusicAiFill } from "react-icons/ri";
import { AccidentalPreference, ChordNotation } from "@/utils/music/constants";
import { parseChordSheet } from "@/utils/music/parseChords";

export default function ChordProViewComponentAlt({
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
        <>
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
            {userData &&
              hasPermission(userData.role as Role, "update:songs") && (
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
        </>
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
