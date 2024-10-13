import { createClient } from '@/utils/supabase/server'
import Link from 'next/link';

export default async function Page() {
  const supabase = createClient()
  const { data: songs, error } = await supabase
  .from('songs')
  .select('*');
  
  if(songs){
    return (
      <>
      <button className="button-transpose" ><a  href="/songs/addSong">Add a New Song!</a></button>
      <br/><br/><br/>
      <h5>List of all Songs</h5>
      {songs.map( (song) =>{
        return (
        <div className='song-list' key={song.id}>
          <p key={song.id}>{song.song_title}<br/><small>{song.author}</small> </p>
          <Link href={`/songs/${song.id}`}>View Song</Link>
        </div> )
      } )
      }
      </>
    )
  }else{
    return <><h1>No song found</h1><a href="/songs/addSong">Add a New Song!</a></>
  }
  
}