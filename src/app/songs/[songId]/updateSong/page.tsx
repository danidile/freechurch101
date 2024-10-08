
import { getSong } from "../getSong";
import {Input} from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import {Textarea} from "@nextui-org/react";


import { updateSong } from "./updateSong";

export default async function Page({ params }: {params:{songId: string}}) {

    const song = await getSong(params.songId);
    console.log(song);
   return( <>
    

    <form>
        <h1 className="text-2xl font-medium">Update Song</h1>
        
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input label="song-title" name="song-title" defaultValue={song.song_title} required />
          
          
          <Input name="author" label="author" defaultValue={song.author}  required />


          <Input label="key"  name="key" required defaultValue={song.upload_key} />


          {/* <Textarea
            label="Lyrics"
            name="lyrics"
            placeholder="Enter your description"
            className="max-w-xs"
            defaultValue={{song.lyrics}}
          /> */}
          
          <Textarea
            label="Lyrics"
            name="lyrics"
            labelPlacement="inside"
            placeholder="inserisci testo"
            defaultValue={song.lyrics}
            minRows={90}
            
          />
          <Input label="author"  name="id" required value={song.id} />

          <Button size="sm" onClick={updateSong} >
          Update Song
          </Button>
        </div>
      </form >




</>)

}