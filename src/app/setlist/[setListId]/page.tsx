
import { Button } from "@nextui-org/react";
import { getSetList } from "./getSetList";
import { getSetListSongs } from "./getSetListSongs";
import ModalLyrics from "./modalLyrics";
import { TsetlistData } from "@/utils/types/types";

export default async function Page({ params }: {params:{setListId: string}}) {
  const setlistData = await getSetList(params.setListId) as TsetlistData;
  const setlistsongs = await getSetListSongs(params.setListId);
    return (
    <div>
      <h6><strong>{setlistData[0].church.church_name}</strong></h6>
      <p>{setlistData[0].date}</p>
      <div className="setlist-song">
          <p>Titolo Canzone</p>
          <p>Tonalità</p>
          <p>Visualizza</p>
      </div>
      {setlistsongs.map((song) =>{
        const songData = [ song.song.song_title , song.song.lyrics]
        return (
          <div key={song.id} className="setlist-song">
            
            <p><strong>{song.song.song_title}</strong></p>
            <div className="key-button">{song.key}</div>
            <ModalLyrics songData={songData}/>
          </div>

        )
      })}


    </div>
    )
  }