// @ts-nocheck
import { getSetList } from "./getSetList";
import { Button } from "@nextui-org/react";
import { getSetListSongs } from "./getSetListSongs";
import ModalLyrics from "./modalLyrics";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MusicNoteIcon from '@mui/icons-material/MusicNote';


export default async function Page({ params }: {params:{setListId: string}}) {
  const setlistData = await getSetList(params.setListId) ;
  const setlistsongs = await getSetListSongs(params.setListId);
  const date = new Date(setlistData.date);
        const readableDate = date.toLocaleString("it-IT", {
          weekday: "long", // "Sunday"
          year: "numeric", // "2024"
          month: "long",   // "November"
          day: "numeric",  // "10"
          // hour: "2-digit", // "10"
          // minute: "2-digit", // "22"
          // second: "2-digit", // "46"
        });
    return (
    <div className="container-sub">
      <div className="song-presentation-container">
      <h6><strong>{setlistData.church.church_name}</strong></h6>
      <p>{readableDate}</p>
      
      {setlistsongs.map((song, index) =>{
        const songData = [ song.songTitle , song.lyrics]
        let toggle = true;
        if(index>0){toggle=false}
        return (
          <>
          {toggle && <div className="setlist-song">
              <p>Titolo Canzone</p>
              <p className="center-"><MusicNoteIcon fontSize="small"/></p>
              <p className="center-"><RemoveRedEyeIcon fontSize="small"/></p>
          </div>}
          <div key={song.id} className="setlist-song">
            
            <p><strong>{song.songTitle}</strong>  <br /><small>{song.notes}</small></p>
            <div className="key-button">{song.key}</div>
            <ModalLyrics songData={songData}/>
          </div>
          
          </>
        )
      })}
      <br/>
      <br/>
      <div className="center-">
          <Button color="primary"  variant="flat">stampa PDF completo</Button>
      </div>
      </div>
    </div>
    )
  }