"use client"
import { Button } from '@nextui-org/react';
import ChordSheetJS from 'chordsheetjs';

import Link from "next/link";
import { useState } from "react"

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function  Song({ songData } : { songData: any }) {
    const chordSheet = songData.lyrics;
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
        <div className='max-w-md w-full'>  
            
            <div className="transpose-button-container">
                <Button variant="flat"><Link href={`/songs/${songData.id}/updateSong`}>Aggiorna Canzone</Link></Button>
                <Button variant="flat" onClick={transposeDown} ><RemoveCircleOutlineIcon/></Button>
                <Button variant="flat" onClick={transposeUp}><AddCircleOutlineIcon/></Button>
            </div>
            <h3>  {songData.author}</h3>
            <p>Questa canzone è stata caricata nella tonalità di {songData.upload_key}</p><br/><br/>
            <div id="song-chords" dangerouslySetInnerHTML={{ __html: state }} style={{whiteSpace: 'pre-wrap'}}/>

            
        </div>
)
}