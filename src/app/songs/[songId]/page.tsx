
// import Link from "next/link";
// import { getSong } from "./getSong";
// import Song from "./transpose";
// import ChordSheetJS from 'chordsheetjs';


// export default async function Page({ params }: {params:{songId: string}}) {
    
//     const song = await getSong(params.songId);

//     if(!song.lyrics){
//       return ;
//     }

//     const lines = song.lyrics.split(/\r?\n/);
//     const lyrics = song.lyrics;
//     let newLyrics = "";

//     for(let i=0; i<lines.length ; i++){
//       if(
//           lines[i].includes('a') ||
//           lines[i].includes('r') ||
//           lines[i].includes('0') || 
//           lines[i].includes('o') || 
//           lines[i].includes('u') || 
//           lines[i].includes('s') ||
//           lines[i].includes('t') ){
//           lines[i] = "<div class='lyrics'>" + lines[i] + "\r</div>";

//           }else if (lines[i].includes("--")){
          
//           lines[i].slice(2);
//           lines[i] = "<br><div class='song-structure'>" + lines[i] + "\r</div>";
          
//           }else{

//           lines[i] = "<div class='sheet-free-chords'>" + lines[i] + "\r</div>";

//           } 
//       newLyrics = newLyrics + lines[i];
//     };
//     song.lyrics = newLyrics;
    
//     return (
//     <div>
//       <Link href={`/songs/chordpro.js`}/>

//       <Song song={song} />
//       <div className="col-md-6 hidden-print">
// 				<label>Enter your ChordPro Markup Below: </label>
// 				<textarea value={lyrics}></textarea>
// 				<label>Transpose?</label>
// 				<div className="transpose">
// 					<a href="#" className="transpose-down"><i className="fa fa-chevron-down"><span className="sr-only">transpose down</span></i></a>
// 					<span className="transpose-level" data-transpose="0">0</span>
// 					<button type="button" className="transpose-up"><i className="fa fa-chevron-up">transpose up<span className="sr-only">transpose up</span></i></button>
// 				</div>
// 			</div>
// 			<div className="col-md-6">
// 				<div className="rendering-target"></div>
//       </div>
//       </div>
//     )
//   }




import Link from "next/link";
import { getSong } from "./getSong";
import Song from "./transpose";
import ChordSheetJS from 'chordsheetjs';


export default async function Page({ params }: {params:{songId: string}}) {
    const songData = await getSong(params.songId);

    return (
    <div>

      <Song songData={songData} />


    </div>
    )
  }