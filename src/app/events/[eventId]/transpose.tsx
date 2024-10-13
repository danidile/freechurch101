"use client"

import Link from "next/link";
import { useState } from "react"

export default function  Song({ song } : { song: any }) {
    const [state, setState] = useState(song.lyrics);
    let match;
    // const chords =
    //     [' C ',' C# ',' D ',' Eb ',' E ',' F ',' F# ',' G ',' Ab ',' A ',' Bb ',' B ',' C ',
    //     ' Db ',' D ',' D# ',' E ',' F ',' Gb ',' G ',' G# ',' A ',' A# ',' C ',
    //     //Nest ones are for the ones that have only one space after but not before(I chose this method because no
    //     // There shoul, in theory never, be a capital letter followed by space in lyrics lines)
    //     'C ','C# ','D ','Eb ','E ','F ','F# ','G ','Ab ','A ','Bb ','B ','C ',
    //     'Db ','D ','D# ','E ','F ','Gb ','G ','G# ','A ','A# ','C '];
    
        var chords =
        ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B','C',
         'Db','D','D#','E','F','Gb','G','G#','A','A#','C'];
    const chordRegex = /C#|D#|F#|G#|A#|Db|Eb|Gb|Ab|Bb|C|D|E|F|G|A|B/g;
    let output = ""; 
    let currentChord;

    const lines = state.split("</div>");


    const transposeUp = ()=>{

        output = "";
        lines.forEach( element => {

                    //check if element has non chord letters

                    currentChord = element;
                    let parts = currentChord.split(chordRegex);
                    console.log(currentChord);
                    if(element.includes('sheet-free-chords'))
                    {
                        var index = 0;
                        while (match = chordRegex.exec(currentChord))
                            {
                                var chordIndex = chords.indexOf(match[0]);
                                output += parts[index++] + chords[chordIndex+1];
                            }
                    }else{

                        output += element;
                    }
                    output += "</div>";


                        
                        
        }) 
        
        setState(output);
    };

    const transposeDown = ()=>{
        output = "";
        lines.forEach(element  => {

                    //check if element has non chord letters

                    currentChord = element;
                    let parts = currentChord.split(chordRegex);

                    if(element.includes('sheet-free-chords'))
                    {
                        var index = 0;
                        while (match = chordRegex.exec(currentChord))
                            {
                                var chordIndex = chords.indexOf(match[0],1);
                                output += parts[index++] + chords[chordIndex-1];
                            }
                    }else{

                        output += element;
                    }
                    output += "</div>";


                        
                        
        }) 
        
        setState(output);
    };




 

    return (
        <>  
            
            <div className="transpose-button-container">
            <button className="button-transpose"><Link href={`/songs/${song.id}/updateSong`}>Update Song</Link></button>

            
                <button className="button-transpose" onClick={transposeDown}>-</button>
                <button className="button-transpose" onClick={transposeUp}>+</button>
            </div>
            <h3>  {song.author}</h3>
            <p>This song was uploaded in the Key of {song.upload_key}</p><br/><br/>
            <div id="song-chords" dangerouslySetInnerHTML={{ __html: state }} style={{whiteSpace: 'pre-wrap'}}/>
            
        </>
)
}