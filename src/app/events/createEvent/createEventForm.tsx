"use client"; 
import { TeventSchema, eventSchema } from "@/utils/types/types";
import {Button} from "@nextui-org/react";
import { Input, Textarea } from '@nextui-org/input';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState,SetStateAction } from "react";
import { toChordPro, toChordsOverWords } from '@/utils/chordProFunctions/chordProFuncs';
import { updateSong } from "./addEventAction";
import { createClient } from '@/utils/supabase/server'
import getSongs from "./getSongs";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";


export default function CreateEventForm( songsList: any ) {

    console.log(songsList.songsList);
    const [state, setState] = useState([]);
    let x;

    const AddSection = (event: { target: { id: any; }; }) => {
        x = Math.floor((Math.random() * 10000000) + 1);
        console.log(event.target.id);
        setState([
            ...state,
            [event.target.id, x ]
            
          ]);
    };

    // section => section[1] === event.target.id)
    const removeSection = (event: { target: { id: any; }; })=>{
        let array = state.filter(section => section[1] != event.target.id);
        console.log(event.target.id);
        console.log(array);

        setState(array);
    };
    
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TeventSchema>({
    resolver: zodResolver(eventSchema),
  });

const convertData = async (data: TeventSchema) =>{
  data.lyrics = state;
  updateSong(data);
}

  
return (<>
    

    <form >
        <h1 className="text-2xl font-medium">Create Event</h1>
        
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <div>
        <Input label="Event title" name="event-title" required />
        </div>
       <div className="container-input-2col">
            <div>
            <Input label="Date" type="date" name="date"  />
            </div>
            <div>
            <Input label="Start" type="time" name="start-hour"  />
            </div>
        </div>

          <Input label="Location" name="location"   />
          

          <p>Aggingi sezione</p>
          

          <div  className="transpose-button-container">
                <Button type="button" id="Canzone" className="button-transpose" onClick={AddSection}>Canzone</Button>
                <Button type="button" id="Predica" className="button-transpose" onClick={AddSection}>Predica</Button>
                <Button type="button" id="Generico" className="button-transpose" onClick={AddSection}>Generico</Button>
            </div>
            
            {
                state.map((element) =>{
                    console.log("Element" + element);
                    return (
                    <div className='flex flex-col gap-1.5 bg-gray-200 rounded-2xl p-4'>
                        <p><strong>{element[0]}</strong></p>

                        <div className="container-input-2col flex gap-1.5">
                             <Input  name={"type"+element[1]} key={element[1]} value={element} className='hide-input' />
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
                                        {songsList.songsList.map((song) => (
                                            
                                        <AutocompleteItem key={song.id} value={song.song_title}>
                                            {song.song_title}
                                        </AutocompleteItem>
                                        ))}
                                    </Autocomplete>
                        </div>
                        <Button isIconOnly type='button' id={element[1]} onClick={removeSection}>X</Button>
                </div>)
                })
            }
          

          

          <br/><br/>
          <Button>
          Add Song
          </Button>
        </div>
      </form>




</>);
}