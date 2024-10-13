
import Link from "next/link";
import { getSong } from "./getSong";
import Song from "./transpose";

export default async function Page({ params }: {params:{songId: string}}) {

    const song = await getSong(params.songId);

    if(!song.lyrics){
      return ;
    }
   
    let lines = song.lyrics.split(/\r?\n/);
    let newLyrics = "";

    for(let i=0; i<lines.length ; i++){
      if(lines[i].includes('r') ||
          lines[i].includes('0') || 
          lines[i].includes('o') || 
          lines[i].includes('u') || 
          lines[i].includes('s') ||
          lines[i].includes('t') ){
          lines[i] = "<div class='lyrics'>" + lines[i] + "\r</div>";

          }else if (lines[i].includes("//")){
          
          lines[i] = "<br><div class='song-structure'>" + lines[i] + "\r</div>";
          lines[i].replace("--", "");
          }else{

          lines[i] = "<div class='sheet-free-chords'>" + lines[i] + "\r</div>";

          } 
      newLyrics += lines[i];
    };
    song.lyrics = newLyrics;
    
    return (
    <div>

      
      <Song song={song} />




      
        
    </div>
    )
  }