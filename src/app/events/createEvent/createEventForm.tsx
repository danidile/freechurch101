"use client"; 
import { TeventSchema, eventSchema } from "@/utils/types/types";
import {Button} from "@nextui-org/react";
import { Input } from '@nextui-org/input';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";

import {Autocomplete, AutocompleteItem} from "@nextui-org/react";


export default function CreateEventForm( songsList: unknown ) {

    
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
        const array = state.filter(section => section[1] != event.target.id);
        console.log(event.target.id);
        console.log(array);

        setState(array);
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
                    console.log("Element" + element);
                    return (
                    <div key="" className='flex flex-col gap-1.5 bg-gray-200 rounded-2xl p-4'>
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
          <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
          Add Song
          </Button>
        </div>
      </form>




</>);
}