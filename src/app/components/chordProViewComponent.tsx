"use client";
import { Button, Link } from "@heroui/react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdModeEdit, MdMoreVert } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { stepsBetweenKeys } from "@/utils/chordProFunctions/stepsBetweenKey";
import { parseChordSheet } from "../songs/[songId]/parseChordSheet";
import { setListSongT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

export default function ChordProViewComponent({
  setListSong,
  userData,
}: {
  setListSong: setListSongT;
  userData?: basicUserData;
}) {
  const [viewChords, setViewChords] = useState(true);
  const [transpose, setTranspose] = useState(
    stepsBetweenKeys(setListSong.upload_key!, setListSong.key!)
  );

  const parsedLyrics = useMemo(
    () => parseChordSheet(setListSong.lyrics!, transpose),
    [setListSong.lyrics, transpose]
  );

  const toggleView = () => setViewChords((v) => !v);
  const changeTranspose = (delta: number) =>
    setTranspose((prev) => Math.max(-10, Math.min(11, prev + delta)));

  return (
    <div className="relative">
      <div className="view-selector-container">
        <Button size="md" variant="ghost" onPress={toggleView}>
          {viewChords ? "Testo" : "Accordi"}
        </Button>

        <div className={`${viewChords ? "opacity-100" : "opacity-0"} transopose-section`}>
          <p>Tonalità:</p>
          <Button isIconOnly variant="light" onPress={() => changeTranspose(-1)} size="md">
            <FaMinus />
          </Button>
          <Button isIconOnly variant="light" onPress={() => changeTranspose(1)} size="md">
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
            <DropdownMenu variant="flat" aria-label="Dropdown menu">
              <DropdownItem startContent={<MdModeEdit />} key="edit">
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

        {parsedLyrics.map((line, i) => {
          if (line.type === "section") return <p key={i} className="comment"><b>{line.text}</b></p>;
          if (line.type === "chords" && viewChords)
            return <p key={i} className="chord">{line.text}</p>;
          if (line.type === "lyrics" || (line.type === "chords" && !viewChords))
            return <p key={i} className="lyrics">{line.text}</p>;
        })}
      </div>
    </div>
  );
}
