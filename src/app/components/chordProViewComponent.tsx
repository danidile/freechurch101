"use client";
import { Button } from "@heroui/react";
import ChordSheetJS from "chordsheetjs";
import { useState } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { stepsBetweenKeys } from "@/utils/chordProFunctions/stepsBetweenKey";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ChordProViewComponent({ songData }: { songData: any }, {showExtra}: {showExtra:boolean}) {
  console.log(songData.lyrics);
  const chordSheet = songData.lyrics;
  const parser = new ChordSheetJS.ChordProParser();
  let song = parser.parse(chordSheet);
  const steps = stepsBetweenKeys(songData.upload_key, songData.key);

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
              <Button variant="flat" onClick={transposeDown}>
                <RemoveCircleOutlineIcon />
              </Button>
              <Button variant="flat" onClick={transposeUp}>
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
          {songData.songTitle} - {songData.author}
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
