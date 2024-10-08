import { createClient } from '@/utils/supabase/server'
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { addSong } from './addSongAction';
import { Textarea } from '@nextui-org/input';

export default async function songs({ searchParams }: { searchParams: Message }) {
  const supabase = createClient()

  let { data: songs, error } = await supabase
  .from('songs')
  .select('*');


  return (<>
    

    <form >
        <h1 className="text-2xl font-medium">Add Song</h1>
        
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="song-title">Song Title</Label>
          <Input name="song-title" required />
          
          
          <Label htmlFor="author">author</Label>
          <Input name="author" required />


          <Label htmlFor="key">Key</Label>
          <Input name="key" required />


          <Label htmlFor="lyrics">Lyrics</Label>
          <textarea style={{border: "1px solid black"}} name="lyrics" rows={50} cols={70}  />



          <SubmitButton formAction={addSong}>
          Add Song
          </SubmitButton>
        </div>
      </form>




</>);
}