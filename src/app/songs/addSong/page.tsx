"use client"; 
import { TsignUpSchema, signUpSchema } from "@/utils/types/types";
import {Button} from "@nextui-org/react";
import { addSong } from './addSongAction';
import { Input, Textarea } from '@nextui-org/input';
import { FieldValues, useForm } from "react-hook-form";
import z from "zod";
import { createClient } from "@/utils/supabase/server";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState,SetStateAction } from "react";
import { toChordPro, toChordsOverWords } from '@/utils/chordProFunctions/chordProFuncs';


export default function App() {
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TsignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

const convertData = async (data: TsignUpSchema) =>{
  data.lyrics = state;
  addSong(data);
}




    const disp = '';
    const [state, setState] = useState(disp);

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

      />
       {errors.songtitle && (
     <p className="text-red-500">{`${errors.songtitle.message}`}</p>
   )}
       
       <Input 
       {...register("author", { required: "Song Title is required", })}
       name="author"
       label="Author"
        />
        </div>
       

       <Input
       {...register("key", { required: "A key is required", })}
       label="Key"  name="key"  />
       {errors.key && (
         <p className="text-red-500">{`${errors.key.message}`}</p>
       )}

        <Button type="button" onClick={convertIntoChordPro} color="primary" variant="flat">
            Convert into ChordPro          
        </Button>
       <Textarea
       {...register("lyrics")}
       value={state}
       onChange={handleInputChange}
       maxRows={25}
       minRows={25}
       cols={60}
       />
       
       <Button type='submit' disabled={isSubmitting}>
         Add Song
       </Button>

     </div>
   </form>




</>);
}