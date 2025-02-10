"use client";
import { Button } from "@heroui/react";
import ChordSheetJS from "chordsheetjs";
import { basicUserData } from "@/utils/types/userData";

import Link from "next/link";
import { useState } from "react";

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Song({
  songData,
  userData,
}: {
  songData: any;
  userData: basicUserData;
}) {
  const chordSheet = songData.lyrics;
  const parser = new ChordSheetJS.ChordProParser();
  const song = parser.parse(chordSheet);
  const formatter = new ChordSheetJS.HtmlTableFormatter();

  const disp = formatter.format(song);

  const [state, setState] = useState(disp);
  const [count, setCount] = useState(0);

  const transposeUp = () => {
    setCount((count) => count + 1);
    const newchords = song.transpose(count + 1);
    const disp = formatter.format(newchords);

    setState(disp);
  };

  const transposeDown = () => {
    setCount((count) => count - 1);
    const newchords = song.transpose(count - 1);
    const disp = formatter.format(newchords);

    setState(disp);
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
    console.log(viewChords);
  };
  console.log(userData);
  return (
    <div className="w-full">
      <div className="view-selector-container">
        <p onClick={viewLyric}>Lyrics</p>
        <p onClick={viewChord}>Chords</p>
      </div>
      <div className="song-presentation-container">
        {viewChords && (
          <div className="top-song-buttons">
            <div className="transpose-button-container">
              <p>Transpose</p>
              <Button variant="flat" onClick={transposeDown}>
                <RemoveCircleOutlineIcon />
              </Button>
              <Button variant="flat" onClick={transposeUp}>
                <AddCircleOutlineIcon />
              </Button>
            </div>
            {["1", "2"].includes(userData.role.toString()) && (
              <Button variant="flat">
                <Link href={`/songs/${songData.id}/updateSong`}>
                  Aggiorna Canzone
                </Link>
              </Button>
            )}
          </div>
        )}

        <h6 className="song-title">
          {songData.song_title} - {songData.author}
        </h6>
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
