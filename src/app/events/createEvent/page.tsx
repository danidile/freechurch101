import { createClient } from '@/utils/supabase/server'
import CreateEventForm from './createEventForm';
export default async function songs() {
  
  const supabase = createClient()
  const { data: songs } = await supabase
  .from('songs')
  .select('*');
  
  return (<>
    
    
      <CreateEventForm songsList={songs} />




</>);
}