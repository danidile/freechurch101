"use client"; 
import { TsongSchema, songSchema } from "@/utils/types/types";
import {Button} from "@nextui-org/react";
import { Input, Textarea } from '@nextui-org/input';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState,SetStateAction } from "react";
import { toChordPro } from '@/utils/chordProFunctions/chordProFuncs';
import { updateSong } from "./updateSongAction";


export default function UpdateSongForm({ songData } : { songData: any }) {
  console.log(songData);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TsongSchema>({
    resolver: zodResolver(songSchema),
  });

const convertData = async (data: TsongSchema) =>{
  data.lyrics = state;
  updateSong(data);
}

    const [state, setState] = useState(songData.lyrics);

    const convertIntoChordPro = ()=>{
      setState(toChordPro(state));  
      console.log(state);
    };
    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
      console.log(event.target.value);
      setState(event.target.value);
    };
  
return (<>
    

  <form  onSubmit={handleSubmit(convertData)} > 
     <h1 className="text-2xl font-medium">Add Song</h1>
     
     <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">

     <div className="flex gap-4 items-center">
     <Input 
     {...register("songtitle",)}
    label="Song Title"
    defaultValue={songData.song_title}
    variant="bordered"
       size="sm"
      />
       {errors.songtitle && (
     <p className="text-red-500">{`${errors.songtitle.message}`}</p>
        )}
       
       <Input 
       {...register("author", { required: "Song Title is required", })}
       name="author"
       label="Author"
       defaultValue={songData.author}
       variant="bordered"
       size="sm"

        />
        </div>
       

       <Input
       {...register("key", { required: "A key is required", })}
       label="Key"  name="key" 
       defaultValue={songData.key}
       variant="bordered"
       size="sm"
       />
       {errors.key && (
         <p className="text-red-500">{`${errors.key.message}`}</p>
       )}


       <Input 
       {...register("id", { required: "", })}
       name="id"
       label="id"
       defaultValue={songData.id}
       className="hidden"
        />

        <Button type="button" onClick={convertIntoChordPro} color="primary" variant="flat">
            Convert into ChordPro          
        </Button>
       <Textarea
       {...register("lyrics")}
       value={state}
       variant="bordered"
       size="sm"

       onChange={handleInputChange}
       maxRows={25}
       minRows={25}
       cols={60}
       />
       
       <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
         Aggiorna Canzone
       </Button>

     </div>
   </form>




</>);
}