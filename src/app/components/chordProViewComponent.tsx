"use client";
import { Button, Link } from "@heroui/react";
import ChordSheetJS from "chordsheetjs";
import { useEffect, useState } from "react";
import { stepsBetweenKeys } from "@/utils/chordProFunctions/stepsBetweenKey";
import { setListSongT } from "@/utils/types/types";
import { FaPlus, FaMinus } from "react-icons/fa";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { MdModeEdit, MdMoreVert } from "react-icons/md";
import { basicUserData } from "@/utils/types/userData";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import CustomizeWidget from "./CustomizeWidget";
import { parseChordSheet } from "../songs/[songId]/parseChordSheet";
export default function ChordProViewComponent({
  setListSong,
  userData,
}: {
  setListSong: setListSongT;
  userData?: basicUserData;
}) {
  const [song, setSong] = useState<setListSongT>(setListSong);
  const [viewChords, setViewChords] = useState(true);
  const [transpose, setTranspose] = useState(0);
  const [parsedLyrics, setParsedLyrics] = useState<
    ReturnType<typeof parseChordSheet>
  >([]);

  useEffect(() => {
    if (song) {
      const parsed = parseChordSheet(song.lyrics!, transpose);
      setParsedLyrics(parsed);
      console.log(parsed);
    }
  }, [song, transpose]);
  return (
    <div className="relative">
      <div className="view-selector-container">
        {viewChords && (
          <Button
            size="md"
            variant="ghost"
            onPress={() => setViewChords(false)}
          >
            Testo
          </Button>
        )}
        {!viewChords && (
          <Button variant="ghost" size="md" onPress={() => setViewChords(true)}>
            Accordi
          </Button>
        )}
        <div
          className={`${viewChords ? "opacity-100" : "opacity-0"} transopose-section`}
        >
          <p>Tonalità:</p>

          <Button
            isIconOnly
            variant="light"
            onPress={() => setTranspose((prev) => (prev >= -10 ? prev - 1 : 0))}
            size="md"
          >
            <FaMinus />
          </Button>
          <Button
            isIconOnly
            variant="light"
            onPress={() => setTranspose((prev) => (prev <= 11 ? prev + 1 : 0))}
            size="md"
          >
            <FaPlus />
          </Button>
        </div>
        {userData && hasPermission(userData.role as Role, "update:songs") && (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" isIconOnly>
                <MdMoreVert className="text-2xl" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dropdown menu with shortcut"
              variant="flat"
            >
              <DropdownItem
                startContent={<MdModeEdit />}
                key="new"
                className="text-center"
              >
                <Link
                  color="foreground"
                  className="w-full text-center"
                  size="sm"
                  href={`/songs/${setListSong.id}/updateSong`}
                >
                  Aggiorna
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>

      <div>
        <h5 className="song-title">{setListSong.song_title}</h5>
        <small>{setListSong.author}</small>
        {parsedLyrics.map((line, index) => {
          if (line.type === "section") {
            return (
              <p key={index} className="comment">
                <b> {line.text}</b>
              </p>
            );
          }

          if (line.type === "chords") {
            if (!viewChords) return null;
            return (
              <p key={index} className="chord">
                {line.text}
              </p>
            );
          }

          return (
            <p key={index} className="lyrics">
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
