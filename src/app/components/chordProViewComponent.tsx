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
import { useParams, usePathname } from "next/navigation";

import { FaPlus, FaMinus } from "react-icons/fa";
import { MdDelete, MdModeEdit, MdMoreVert } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import ChordSheetJS from "chordsheetjs";
import { FaRegTrashAlt } from "react-icons/fa";

import { useEffect, useMemo, useState } from "react";
import { stepsBetweenKeys } from "@/utils/chordProFunctions/stepsBetweenKey";
import { parseChordSheet } from "../songs/[songId]/parseChordSheet";
import { setListSongT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import isChordProFormat from "./isChordProFormat";
import { useUserStore } from "@/store/useUserStore";
import { deleteSong } from "../songs/[songId]/deleteSongAction";
import Link from "next/link";
import CopyLinkButton from "./CopyLinkButton";
import CopyLinkButtonWithText from "./CopyLinkButtonWithText";

export default function ChordProViewComponent({
  setListSong,
}: {
  setListSong: setListSongT;
}) {
  const pathname = usePathname(); // e.g. "/italiansongs/7784d9a0-2d3d..."

  const { userData } = useUserStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Check if uses chordpro format
  const [isChordPro, setIsChordPro] = useState(false);
  useEffect(() => {
    setIsChordPro(isChordProFormat(setListSong.lyrics));
  }, [setListSong.lyrics]);

  // if it doesnt use custom parser.
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

  // IF IT USES CHORDPRO USE CHORDSHEETSJS

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

  const chordSheet = setListSong.lyrics;
  const parser = new ChordSheetJS.ChordProParser();
  let song = parser.parse(chordSheet);
  const steps = stepsBetweenKeys(setListSong.upload_key, setListSong.key);
  song = song.transpose(steps);
  const formatter = new ChordSheetJS.HtmlTableFormatter();
  const disp = formatter.format(song);

  const [state, setState] = useState(disp);
  const [count, setCount] = useState(0);
  const [songKey, setSongKey] = useState(
    setListSong.key || setListSong.upload_key
  );

  const transposeUp = () => {
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      const newchords = song.transpose(newCount); // Use newCount here
      const disp = formatter.format(newchords);
      setState(disp);
      return newCount; // Return updated count
    });
    setSongKey(
      keys[(keys.findIndex((key) => key === songKey) + 1) % keys.length]
    );
  };

  const transposeDown = () => {
    setCount((prevCount) => {
      const newCount = prevCount - 1;
      const newchords = song.transpose(newCount); // Use newCount here
      const disp = formatter.format(newchords);
      setState(disp);
      return newCount; // Return updated count
    });
    setSongKey(
      keys[
        (keys.findIndex((key) => key === songKey) - 1 + keys.length) %
          keys.length
      ]
    );
  };

  return (
    <div className="relative">
      <div className="view-selector-container">
        <Button size="md" variant="ghost" onPress={toggleView}>
          {viewChords ? "Testo" : "Accordi"}
        </Button>

        <div
          className={`${viewChords ? "opacity-100" : "opacity-0"} transopose-section`}
        >
          <p>Tonalità:</p>
          <Button
            isIconOnly
            variant="light"
            onPress={() => {
              changeTranspose(-1);
              transposeDown();
            }}
            size="md"
          >
            <FaMinus />
          </Button>
          <Button
            isIconOnly
            variant="light"
            onPress={() => {
              changeTranspose(1);
              transposeUp();
            }}
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
            <DropdownMenu variant="flat" aria-label="Dropdown menu">
              <DropdownItem
                startContent={<MdModeEdit />}
                as={Link}
                href={`/${pathname.split("/")[1]}/${setListSong.id}/update`}
                key="edit"
              >
                Aggiorna
              </DropdownItem>

              <DropdownItem
                startContent={<MdDelete />}
                variant="flat"
                onPress={onOpen}
                key="delete"
                className="text-danger"
                color="danger"
              >
                Elimina
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>

      <div>
        <h5 className="song-title">{setListSong.song_title}</h5>
        <small>{setListSong.author}</small>
        {!isChordPro && (
          <>
            {parsedLyrics.map((line, i) => {
              if (line.type === "section")
                return (
                  <p key={i} className="comment">
                    <b>{line.text}</b>
                  </p>
                );
              if (line.type === "chords" && viewChords)
                return (
                  <p key={i} className="chord">
                    {line.text}
                  </p>
                );
              if (line.type === "lyrics")
                return (
                  <p key={i} className="lyrics">
                    {line.text}
                  </p>
                );
            })}
          </>
        )}
        {isChordPro && (
          <>
            {viewChords && (
              <>
                <p>
                  Tonalità canzone: <span className="chord">{songKey}</span>
                </p>
                <div
                  id="song-chords"
                  dangerouslySetInnerHTML={{ __html: state }}
                  style={{ whiteSpace: "pre-wrap" }}
                />
              </>
            )}
            {!viewChords && (
              <div
                id="song-lyrics"
                dangerouslySetInnerHTML={{ __html: state }}
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
                    Sei sicuro di voler eliminare questaa Canzone?
                  </span>{" "}
                  Eliminerai tutti i dati relativi a questa canzone. Se sì
                  clicca su
                  <strong>"Elimina"</strong> altrimenti clicca su cancella.
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
