import { createClient } from '@/utils/supabase/server'
import CreateEventForm from './createEventForm';

export default async function songs() {
  

  const supabase = createClient()
  const { data: songs  } = await supabase
  .from('songs')
  .select('*');
  if(songs){
    const newSongList = songs;

    console.log("New Song List " + newSongList);
    return (<>
      
      
       <CreateEventForm {...newSongList} /> 
  
  
  
  
  </>);
  }
  
}