import { createClient } from '@/utils/supabase/server'
import CreateEventForm from './createEventForm';
export default async function songs() {
  

  interface TsongList {
    author: string;
    created_at: Date;
    id: number;
    lyrics: string;
    song_title: string;
    upload_key: string;
  }

  const supabase = createClient()
  const { data: songs  } = await supabase
  .from('songs')
  .select('*');
  if(songs){
    const newSongList: Array<TsongList> | null = songs;
    console.log("New Song List " + newSongList);
    return (<>
      
      
       {/* <CreateEventForm {...newSongList} />  */}
  
  
  
  
  </>);
  }
  
}