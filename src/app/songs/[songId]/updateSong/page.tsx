
import { getSong } from "../getSong";
import {Input} from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import {Textarea} from "@nextui-org/react";


import { updateSong } from "./updateSong";

export default async function Page({ params }: {params:{songId: string}}) {

    const song = await getSong(params.songId);
    console.log(song);
   return( <>
    
    <form action={updateSong}>
        <h1 className="text-2xl font-medium">Update Song</h1>
        
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input size="sm" label="song-title" name="song-title" defaultValue={song.song_title} required />
          
          
          <Input size="sm" name="author" label="author" defaultValue={song.author}  required />


          <Input size="sm" label="key"  name="key" required defaultValue={song.upload_key} />
          <div id='textarea-wrapper'>

          <Textarea
            label="Lyrics"
            name="lyrics"
            placeholder="inserisci testo"
            defaultValue={song.lyrics}
            size="sm"
            minRows={50}
            maxRows={200}
            cols={100}
          />
          </div>

          <Input size="sm" label="author" className="hide-input" name="id" required value={song.id} />

          <Button type="submit" size="sm">
          Update Song
          </Button>
        </div>
      </form >




</>)

}