// @ts-nocheck

import { createClient } from '@/utils/supabase/server'
import Link from 'next/link';
import ListAltIcon from '@mui/icons-material/ListAlt';
export default async function Page() {
  const supabase = createClient()
  const { data: setlist } = await supabase
  .from('setlist')
  .select('id, church("church_name"),event_title,date');

  if(setlist){
    return (
      <>
      <button className="button-transpose"><a  href="/setlist/addSetlist">Crea nuova Setlist!</a></button>
      <br/><br/><br/>
      <h5>List of all Events</h5>
      {setlist.map( (setlist) =>{
        const date = new Date(setlist.date);
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
          
        <div className='song-list' key={setlist.id}>
          <Link className='song-list-link' href={`/setlist/${setlist.id}`}>
          <p key={setlist.id}>{setlist.event_title}<br/><small>{readableDate}</small> </p>
          <ListAltIcon/>
          </Link>
        </div> )
      } )
      }

      
      </>
    )
  }else{
    return <><h1>No song found</h1><a href="/songs/addSong">Add a New Song!</a></>
  }
  
}