"use client"
import { Button } from "@heroui/react";
import ChordSheetJS from "chordsheetjs";
import { useState } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { stepsBetweenKeys } from "@/utils/chordProFunctions/stepsBetweenKey";
import { setListSongT } from "@/utils/types/types";
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
    setCount(count + 1);
    const newchords = song.transpose(count);
    const disp = formatter.format(newchords);

    setState(disp);
  };

  const transposeDown = () => {
    setCount(count - 1);
    const newchords = song.transpose(count);
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

  return (
    <div>
      <div className="view-selector-container">
        <p onClick={viewLyric}>Lyrics</p>
        <p onClick={viewChord}>Chords</p>
      </div>

      <div>
        <div className="top-song-buttons">
          <div className="transpose-button-container">
            <p>Transpose</p>
            <Button variant="flat" onPress={transposeDown}>
              <RemoveCircleOutlineIcon />
            </Button>
            <Button variant="flat" onPress={transposeUp}>
              <AddCircleOutlineIcon />
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
