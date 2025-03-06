"use client";
import { Button, Link } from "@heroui/react";
import ChordSheetJS from "chordsheetjs";
import { useState } from "react";
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
export default function ChordProViewComponent({
  setListSong,
  userData,
}: {
  setListSong: setListSongT;
  userData?: basicUserData;
}) {
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
    console.log("transposeUp");
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
    console.log("transposeDown");
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
  const [viewChords, setViewChords] = useState(true);

  const viewChord = () => {
    if (viewChords === false) {
      setViewChords(true);
    }
    console.log(viewChords);
  };

  const viewLyric = () => {
    if (viewChords === true) {
      setViewChords(false);
    }
  };
  return (
    <div>
      <div className="view-selector-container">
        {viewChords && (
          <Button size="md" onPress={viewLyric}>
            Testo
          </Button>
        )}
        {!viewChords && (
          <Button size="md" onPress={viewChord}>
            Accordi
          </Button>
        )}

        <div className="transopose-section">
          <p>Tonalità:</p>

          <Button isIconOnly variant="light" onPress={transposeDown} size="md">
            <FaMinus />
          </Button>
          <Button isIconOnly variant="light" onPress={transposeUp} size="md">
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
        <h5 className="song-title">
          {setListSong.song_title}
        </h5>
        <small>{setListSong.author}</small>

        <p>Tonalità canzone: <span className="chord">{songKey}</span></p>
        {viewChords && (
          <div
            id="song-chords"
            dangerouslySetInnerHTML={{ __html: state }}
            style={{ whiteSpace: "pre-wrap" }}
          />
        )}
        {!viewChords && (
          <div
            id="song-lyrics"
            dangerouslySetInnerHTML={{ __html: state }}
            style={{ whiteSpace: "pre-wrap" }}
          />
        )}
      </div>
    </div>
  );
}
