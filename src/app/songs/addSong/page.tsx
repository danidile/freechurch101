"use client"; 
import { TsignUpSchema, signUpSchema } from "@/utils/types/types";
import {Button} from "@nextui-org/react";
import { addSong } from './addSongAction';
import { Input } from '@nextui-org/input';
import SongTextArea from './songLyricsTextArea';
import { FieldValues, useForm } from "react-hook-form";
import z from "zod";
import { createClient } from "@/utils/supabase/server";
import { zodResolver } from '@hookform/resolvers/zod';


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
  addSong(data);

}

  

  return (<>
    

     <form  onSubmit={handleSubmit(convertData)} > 
        <h1 className="text-2xl font-medium">Add Song</h1>
        
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Input 
        {...register("songtitle",)}

         />
          {errors.songtitle && (
        <p className="text-red-500">{`${errors.songtitle.message}`}</p>
      )}
          
          <Input 
          {...register("author", {
            required: "Song Title is required",
          })}
          name="author" label="author"
           />
          

          <Input
         
          
          {...register("key", {
            required: "A key is required",
          })}
          label="key"  name="key"  />
          {errors.key && (
            <p className="text-red-500">{`${errors.key.message}`}</p>
          )}
          <SongTextArea/>
          
          

          <Button type='submit' disabled={isSubmitting}>
            Add Song
          </Button>

        </div>
      </form>




</>);
}