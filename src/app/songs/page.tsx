import { createClient } from '@/utils/supabase/server'
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

export default async function Page() {
  const supabase = createClient()
  const { data: songs } = await supabase
  .from('songs')
  .select('*');
  
  if(songs){
    return (
      <>
      <h5>Lista di tutte le canzoni</h5>
      <Button color="primary" variant="ghost"><a href="/songs/addSong">Aggiungi una canzone!</a></Button>

      {songs.map( (song) =>{
        return (
        <div className='song-list' key={song.id}>
          <p key={song.id}>{song.song_title}<br/><small>{song.author}</small> </p>
          <Link href={`/songs/${song.id}`}>
              <span className="material-symbols-outlined">
              <QueueMusicIcon/>
              </span>
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