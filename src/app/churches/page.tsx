import { createClient } from '@/utils/supabase/server'
import Link from 'next/link';

export default async function Page() {
  const supabase = createClient()

  
const { data: churches } = await supabase
.from('churches')
.select();
        

  if(churches){
    console.log(churches);
    return (
      <>
      <h2>Churches</h2>
      {churches.map( (church) =>{
        return (
        <div className='song-list' key={church.id}>
          <p key={church.id}>{church.church_name}<br/><small>{church.ig_handle}</small> </p>
          <Link href={`/songs/${church.id}`}>
              <span className="material-symbols-outlined">
              lyrics
              </span>
          </Link>
        </div> )
      } )
      }
            <a href="/churches/addChurch">Add a New Church!</a>

      </>
    )
  }else{
    return <p>No churches found</p>
  }
  
}