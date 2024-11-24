"use client"
import { Button } from '@nextui-org/react';
import ChordSheetJS from 'chordsheetjs';
import { useState } from "react"

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function  ChordProViewComponent({songData}: {songData: any}) {
    const chordSheet = songData[1];
    const parser = new ChordSheetJS.ChordProParser();
    const song = parser.parse(chordSheet);
    const formatter = new ChordSheetJS.HtmlTableFormatter();
    
    const disp = formatter.format(song);

    const [state, setState] = useState(disp);
    const [count, setCount] = useState(0);    

    
    const transposeUp = ()=>{
        setCount(count+1);
        const newchords = song.transpose(count);
        const disp = formatter.format(newchords);
        
        setState(disp);
    };

    const transposeDown = ()=>{
        setCount(count-1);
        const newchords = song.transpose(count);
        const disp = formatter.format(newchords);
        
        setState(disp);
    };


    return (
        <div>  
            
            <div className="transpose-button-container">
                <Button variant="flat" onClick={transposeDown} ><RemoveCircleOutlineIcon/></Button>
                <Button variant="flat" onClick={transposeUp}><AddCircleOutlineIcon/></Button>
            </div>
            <h6>{songData[0]}</h6>
            <div id="song-chords" dangerouslySetInnerHTML={{ __html: state }} style={{whiteSpace: 'pre-wrap'}}/>

        </div>
)
}