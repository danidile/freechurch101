"use client"
import ChordSheetJS from 'chordsheetjs';

import Link from "next/link";
import { useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function  Song({ songData } : { songData: any }) {
    const chordSheet = songData.lyrics;
    const parser = new ChordSheetJS.ChordProParser();
    const song = parser.parse(chordSheet);
    const formatter = new ChordSheetJS.TextFormatter();
    
    const proFormatter = new ChordSheetJS.ChordProFormatter();
    const disp = formatter.format(song);

    const [state, setState] = useState(disp);
    const [count, setCount] = useState(0);    

    
    const transposeUp = ()=>{
        setCount(count+1);
        const newchords = song.transpose(count);
        const disp = formatter.format(newchords);
        console.log(count);
        
        setState(disp);
    };

    const transposeDown = ()=>{
        setCount(count-1);
        const newchords = song.transpose(count);
        const disp = formatter.format(newchords);
        
        setState(disp);
    };


    return (
        <>  
            
            <div className="transpose-button-container">
            <button className="button-transpose"><Link href={`/songs/${songData.id}/updateSong`}>Update Song</Link></button>


                <button className="button-transpose" onClick={transposeDown} >-</button>
                <button className="button-transpose" onClick={transposeUp}>+</button>
            </div>
            <h3>  {songData.author}</h3>
            <p>This song was uploaded in the Key of {songData.upload_key}</p><br/><br/>
            <div id="song-chords" dangerouslySetInnerHTML={{ __html: state }} style={{whiteSpace: 'pre-wrap'}}/>

            
        </>
)
}