"use client"; 
import { TeventSchema, eventSchema } from "@/utils/types/types";
import {Button} from "@nextui-org/react";
import { Input } from '@nextui-org/input';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";

import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
interface Tsections {
  id: string;
  key: string;
}

interface Tsong {
  id: string;
  song_title: string;
}

interface TsongList {
  author: string;
  created_at: string;
  id: string;
  lyrics: string;
  song_title: string;
  upload_key: string;
}


export default function CreateEventForm( newSongList: Array<TsongList> ) {

    console.log(newSongList);
    const [state, setState] = useState<Tsections[]>([]);
    let x: string;



    const AddSection = (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget as HTMLInputElement 
      if(target){

      x = JSON.stringify(Math.floor((Math.random() * 10000000) + 1));
        const id = target.id;
        setState((section) => [
            ...section,
            {id: id, key: x }
            
          ]);
        }
    };

    // section => section[1] === event.target.id)
    const removeSection = (event: React.MouseEvent<HTMLButtonElement>)=>{
      const target = event.currentTarget as HTMLInputElement 
      if(target){
        const array = state.filter(section => section.key != target.id);

        setState(array);
      }
    };
    
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TeventSchema>({
    resolver: zodResolver(eventSchema),
  });

const convertData = async (data: TeventSchema) =>{
  console.log(data);

}

  
return (<>
    

    <form  onSubmit={handleSubmit(convertData)}>
        <h1 className="text-2xl font-medium">Create Event</h1>
        
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <div>
        <Input {...register("eventTitle")} label="Event title" name="event-title" required />
        </div>
       <div className="container-input-2col">
            <div>
            <Input {...register("date")} label="Date" type="date" name="date"  />
            </div>
            <div>
            <Input {...register("start")} label="Start" type="time" name="start-hour"  />
            </div>
        </div>

          <Input {...register("location")} label="Location" name="location"   />
          

          <p>Aggingi sezione</p>
          

          <div  className="transpose-button-container">
                <Button type="button" id="Canzone" className="button-transpose" onClick={AddSection}>Canzone</Button>
                <Button type="button" id="Predica" className="button-transpose" onClick={AddSection}>Predica</Button>
                <Button type="button" id="Generico" className="button-transpose" onClick={AddSection}>Generico</Button>
            </div>
            
            {
                state.map((element) =>{
                    return (
                    <div key={element.key} className='flex flex-col gap-1.5 bg-gray-200 rounded-2xl p-4'>
                        <p><strong>{element.id}</strong></p>

                        <div className="container-input-2col flex gap-1.5">
                             <Input  name={"type"+element.key} key={element.key} value={element.id} className='hide-input' />
                                <div>
                                    <Input label="Duration:"  type="time" name="duration"  />
                                </div>
                                <div>
                                    <Input label="Event Starts at:" type="time" name="start-hour"  />
                                </div>
                        </div>
                        <div>
                                    <Autocomplete 
                                        label="Select an animal" 
                                        className="max-w-xs" 
                                    >
                                        {newSongList.map((song: Tsong) => (
                                            
                                        <AutocompleteItem key={song.id} value={song.song_title}>
                                            {song.song_title}
                                        </AutocompleteItem>
                                        ))}
                                    </Autocomplete>
                        </div>
                        <Button isIconOnly type='button' id={element.key} onClick={removeSection}>X</Button>
                </div>)
                })
            }
          

          

          <br/><br/>
          <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
          Add Song
          </Button>
        </div>
      </form>




</>);
}