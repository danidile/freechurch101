// import CustomizeWidget from "@/app/components/CustomizeWidget";
// import { getSongs } from "@/hooks/GET/getSongs";
// import { songType } from "@/utils/types/types";
// import { Button } from "@heroui/button";
// import ChordSheetJS from "chordsheetjs";
// import { importSongs } from "./importSongsAction";
// import { ImportaCanzoni } from "./ImportaCanzoni";

// export default async function Page() {
//   const songData: songType[] = await getSongs();
//   const parser = new ChordSheetJS.ChordProParser();

//   const updatedSongs = await songData.map((song: songType) => {
//     const songElement = parser.parse(song.lyrics);
//     const formatter = new ChordSheetJS.TextFormatter();
//     const disp = formatter.format(songElement);

//     return {
//       id: song.id,
//       song_title: song.song_title,
//       author: song.author,
//       upload_key: song.upload_key,
//       church: "24a8b487-5c81-47c9-8d6c-28fe08a1917c",
//       lyrics: disp, // update the lyrics field with formatted HTML
//     };
//   });

//   console.log(songData);
//   if (updatedSongs) {
//     return (
//       <div className="container-sub">
//         <p>Titolo</p>
//         <ImportaCanzoni updatedSongs={updatedSongs}></ImportaCanzoni>
//         {songData.map((song,index) => {
//           return <p>{index+ " "+song.song_title}</p>;
//         })}
//       </div>
//     );
//   } else {
//     console.log("ERRORERRRRRR" + songData);
//     return <div className="container-sub">Errore</div>;
//   }
// }
