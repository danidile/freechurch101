// @ts-nocheck
import { getSetList } from "./getSetList";
import { Button } from "@nextui-org/react";
import { getSetListSongs } from "./getSetListSongs";
import ModalLyrics from "./modalLyrics";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
interface Setlist {
  id: string;
  church_name: string; // nested object from the `church` table
  date: Date; // or `Date` if it's a date object
}

export default async function Page({ params }: {params:{setListId: string}}) {
  const setlistData = await getSetList(params.setListId) ;
  const setlistsongs = await getSetListSongs(params.setListId);
  console.log("This is my result" + setlistsongs +setlistData);
    return (
    <div>
      <h6><strong>{setlistData.church.church_name}</strong></h6>
      <p>{setlistData.date}</p>
      
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
            
            <p><strong>{song.songTitle}</strong></p>
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
    )
  }