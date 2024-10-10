import { createClient } from '@/utils/supabase/server'
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default async function Page() {
  const supabase = createClient()
  const { data: songs } = await supabase
  .from('songs')
  .select('*');
  
  if(songs){
    return (
      <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=lyrics" />
      <h5>Lista di tutte le canzoni</h5>
      <Button color="primary" variant="ghost"><a href="/songs/addSong">Aggiungi una canzone!</a></Button>

      {songs.map( (song) =>{
        return (
        <div className='song-list' key={song.id}>
          <p key={song.id}>{song.song_title}<br/><small>{song.author}</small> </p>
          <Link href={`/songs/${song.id}`}>
              <span className="material-symbols-outlined">
              lyrics
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