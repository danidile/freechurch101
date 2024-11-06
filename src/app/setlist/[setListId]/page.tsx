// @ts-nocheck
import { getSetList } from "./getSetList";
import { getSetListSongs } from "./getSetListSongs";
import ModalLyrics from "./modalLyrics";
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
              <p>Tonalità</p>
              <p>Visualizza</p>
          </div>}
          <div key={song.id} className="setlist-song">
            
            <p><strong>{song.songTitle}</strong></p>
            <div className="key-button">{song.key}</div>
            <ModalLyrics songData={songData}/>
          </div>
          </>
        )
      })}

    </div>
    )
  }