"use client"; 
import { TsongSchema, songSchema } from "@/utils/types/types";
import {Button} from "@nextui-org/react";
import { addSong } from './addSongAction';
import { Input, Textarea } from '@nextui-org/input';
import {  useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState,SetStateAction } from "react";
import { toChordPro } from '@/utils/chordProFunctions/chordProFuncs';


export default function App() {
  
    const {
      register,
      handleSubmit,
      formState: {  isSubmitting },
    } = useForm<TsongSchema>({
      resolver: zodResolver(songSchema),
    });

    const convertData = async (data: TsongSchema) =>{
      data.lyrics = state;
      console.log(data.lyrics);
      addSong(data);
    }




    const disp = '';
    const [state, setState] = useState(disp);


    const convertIntoChordPro = ()=>{
      setState(toChordPro(state));  
    };


    const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
      setState(event.target.value);
    };
  
return (<>
    

  <form  onSubmit={handleSubmit(convertData)} > 
     <h1 className="text-2xl font-medium">Add Song</h1>
     
     <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">

     <div className="flex gap-4 items-center">
     <Input 
     {...register("song_title",)}
      label="Song Title"
      variant="bordered"
       size="sm"


      />
      
       
       <Input 
       {...register("author", { required: "Song Title is required", })}
       name="author"
       label="Author"
       variant="bordered"
       size="sm"
       
        />
        </div>
       

       <Input
       {...register("upload_key", { required: "A key is required", })}
       label="Key"  name="key" 
       variant="bordered"
       size="sm"
       
       />

        <Button  type="button" onClick={convertIntoChordPro}  color="primary" variant="flat">
            Convert into ChordPro          
        </Button>
       <Textarea
       {...register("lyrics")}
       value={state}
       onChange={handleInputChange}
       maxRows={65}
       minRows={45}
       cols={100}
       variant="bordered"
       size="sm"
       />
       
       <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
         Add Song
       </Button>

     </div>
   </form>




</>);
}