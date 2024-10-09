import { createClient } from '@/utils/supabase/server'
import {Button} from "@nextui-org/react";

import { addSong } from './addSongAction';
import { Input, Textarea } from '@nextui-org/input';
import SongTextArea from './songLyricsTextArea';
export default async function songs() {
  return (<>
    

     <form  /*action={addSong}*/ > 
        <h1 className="text-2xl font-medium">Add Song</h1>
        
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Input label="song-title" name="song-title" required />
          
          
          <Input name="author" label="author" required />


          <Input label="key"  name="key" required />
          
          <SongTextArea/>
          
          

          <Button>
            Add Song
          </Button>

        </div>
      </form>




</>);
}