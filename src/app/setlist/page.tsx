// @ts-nocheck

import { createClient } from '@/utils/supabase/server'
import Link from 'next/link';

export default async function Page() {
  const supabase = createClient()

  const { data: setlist } = await supabase
  .from('setlist')
  .select('id, church("church_name")');

  if(setlist){
    return (
      <>
      <button className="button-transpose" ><a  href="/events/createEvent">Create a New Event!</a></button>
      <br/><br/><br/>
      <h5>List of all Events</h5>
      {setlist.map( (setlist) =>{
        return (
        <div className='song-list' key={setlist.id}>
          <p key={setlist.id}>{setlist.church.church_name}<br/><small>{setlist.author}</small> </p>
          <Link href={`/setlist/${setlist.id}`}>Visualizza SetList</Link>
        </div> )
      } )
      }

      
      </>
    )
  }else{
    return <><h1>No song found</h1><a href="/songs/addSong">Add a New Song!</a></>
  }
  
}