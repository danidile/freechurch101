"use client"
import { Button } from "@heroui/react";
import ChordSheetJS from "chordsheetjs";
import { useState } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { stepsBetweenKeys } from "@/utils/chordProFunctions/stepsBetweenKey";
import { setListSongT } from "@/utils/types/types";
import { FaPlus,FaMinus } from "react-icons/fa";

export default function ChordProViewComponent({
  setListSong,
}: {
  setListSong: setListSongT;
}) {
  console.log(setListSong.lyrics);
  console.log("songData");
  const chordSheet = setListSong.lyrics;
  const parser = new ChordSheetJS.ChordProParser();
  let song = parser.parse(chordSheet);
  const steps = stepsBetweenKeys(setListSong.upload_key, setListSong.key);

  song = song.transpose(steps);
  const formatter = new ChordSheetJS.HtmlTableFormatter();

  const disp = formatter.format(song);

  const [state, setState] = useState(disp);
  const [count, setCount] = useState(0);

  const transposeUp = () => {
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      const newchords = song.transpose(newCount); // Use newCount here
      const disp = formatter.format(newchords);
      setState(disp);
      return newCount; // Return updated count
    });
  };

  const transposeDown = () => {
    setCount((prevCount) => {
      const newCount = prevCount - 1;
      const newchords = song.transpose(newCount); // Use newCount here
      const disp = formatter.format(newchords);
      setState(disp);
      return newCount; // Return updated count
    });
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

  return (
    <div>
      <div className="view-selector-container">
        <p onClick={viewLyric} >Testo</p>
        <p onClick={viewChord}>Accordi</p>
      </div>

      <div>
        <div className="top-song-buttons">
          <div className="transpose-button-container">
            <p>Tonalità</p>
            <Button isIconOnly radius="full" variant="light" onPress={transposeDown} size="lg">
              <FaMinus />
            </Button>
            <Button isIconOnly radius="full" variant="light" onPress={transposeUp} size="lg">
              <FaPlus />
            </Button>
          </div>
          {/* <Button variant="flat">
            <Link href={`/songs/${songData.id}/updateSong`}>
              Aggiorna Canzone
            </Link>
          </Button> */}
        </div>

        <h5 className="song-title">
          {setListSong.song_title} - {setListSong.author}
        </h5>

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
