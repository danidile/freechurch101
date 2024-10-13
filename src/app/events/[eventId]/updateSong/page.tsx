
import { Label } from "@/components/ui/label";
import { getSong } from "../getSong";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { updateSong } from "./updateSong";

export default async function Page({ params }: {params:{songId: string}}) {

    const song = await getSong(params.songId);
    console.log(song);
   return( <>
    

    <form>
        <h1 className="text-2xl font-medium">Update Song</h1>
        
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="song-title">Song Title</Label>
          <Input name="song-title" value={song.song_title} required />
          
          
          <Label htmlFor="author">author</Label>
          <Input name="author" value={song.author}  required />


          <Label htmlFor="key">Key</Label>
          <Input name="key" required value={song.upload_key} />


          <Label htmlFor="lyrics">Lyrics</Label>
          <textarea style={{border: "1px solid black"}} name="lyrics" rows={50} cols={70}  >{song.lyrics}</textarea>

          <Input name="id" required value={song.id} />

          <SubmitButton formAction={updateSong} >
          Update Song
          </SubmitButton>
        </div>
      </form >




</>)

}