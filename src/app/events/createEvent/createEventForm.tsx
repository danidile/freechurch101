"use client"; 
import { TeventSchema, eventSchema } from "@/utils/types/types";
import {Button} from "@nextui-org/react";
import { Input } from '@nextui-org/input';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { Select, SelectItem, Textarea} from "@nextui-org/react";
import { Image } from "@nextui-org/react";

import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
interface Tsections {
  id: string;
  key: string;
  isSong: boolean;
  isTitle: boolean;
  description: string;
}
interface TeventBasics {
  type: string;
  title: string;
  date: string;
}

interface Tsong {
  id: string;
  song_title: string;
}
interface TsongNameAuthor {
  id: string;
  author: string;
  song_title: string;
}

export default function CreateEventForm({songsList}: {songsList : TsongNameAuthor[]}) {
    const newSongList = songsList;
    const [state, setState] = useState<Tsections[]>([{id: "Titolo", key:"542908453", isSong: false, isTitle:true, description:""}]);
    const [eventDetails, setEventDetails] = useState<TeventBasics>({type: '0', title: "Culto domenicale", date: ""});
    const [eventIsOther, setEventIsOther] = useState(false);
    let x: string;
    const durata = ["5min","10min","15min","20min","30min","40min","50min","1h","1:30h"];
    const tipoEvento = ["Culto domenicale","Riunione di Preghiera","Studio biblico","Riunione Giovani","Altro..."];

    const AddSection = (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget as HTMLInputElement 
      if(target){

      x = JSON.stringify(Math.floor((Math.random() * 10000000) + 1));
        const id = target.id;
        if(target.id === "Canzone"){
          setState((section) => [
            ...section,
            {id: id, key: x ,isSong: true, isTitle: false, description: ""}
            
          ]);
        } else if(target.id === "Titolo"){
          setState((section) => [
            ...section,
            {id: id, key: x , isSong: false, isTitle: true, description: ""}
            
          ]);
        }else{
          setState((section) => [
            ...section,
            {id: id, key: x , isSong: false, isTitle: false, description: ""}
            
          ]);
        }
        }
    };

    const {
      register,
      handleSubmit,
      formState: { isSubmitting, errors },
    } = useForm<TeventSchema>({
      resolver: zodResolver(eventSchema),
    });

    // section => section[1] === event.target.id)
    const removeSection = (event: React.MouseEvent<HTMLButtonElement>)=>{
      const target = event.currentTarget as HTMLInputElement 
      if(target){
        setState(state.filter(section => section.key != target.id));
      }

    };
    
    const istypeother = (event: React.ChangeEvent<HTMLSelectElement>) =>{

      console.log(event.target.value);
      setEventDetails({ ...eventDetails, type: event.target.value });
      if(event.target.value == '4'){
        setEventIsOther(true);
      }else{
        setEventIsOther(false);
      }
    }
    const editTitle =(event: React.ChangeEvent<HTMLInputElement>)=>{
      const target = event.currentTarget as HTMLInputElement 

      setEventDetails({ ...eventDetails, title: target.value });
    }
    const editDate = (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.currentTarget as HTMLInputElement 

      setEventDetails({ ...eventDetails, date: target.value });
    }
    const editDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.currentTarget as HTMLInputElement 

        setState(
          state.map((section) => {
            if(section.key == target.id){
              section.description = target.value;
              return section;
            }else{
              return section;
            }
            
          })
        );
    }

  const convertData = async (data: TeventSchema) =>{
  console.log(data);
}

return (<>

    <div className=" flex flex-row rounded-xl gap-3">
    <div className="form-div">
    <form onSubmit={handleSubmit(convertData)} >
        <h4>Crea Evento</h4>
        
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <div className="gap-1.5">
        <Select
                                    {...register(`eventType`)}
                                      label="Tipo di evento"
                                      size="sm"
                                      placeholder="Riunione dei Giovani..."
                                      onChange={istypeother}
                                    >
                                      {tipoEvento.map((evento:string ,index) => (
                                            
                                            <SelectItem key={index} value={evento}>
                                                {evento}
                                            </SelectItem>
                                            ))}
        </Select>
        {eventIsOther && (
          <Input
        type="text"
        label="Aggiungi Titolo evento"
        variant="bordered"
        size="sm"
        {...register("eventTitle")}
        onChange={editTitle}
        />)}
        
        </div>
       <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
       <Input
            type="date"
            label="Event Date"
            variant="bordered"
            size="sm"
            {...register("date")}
            onChange={editDate}

        />


      {errors.date && <p>{errors.date.message}</p>}

        </div>
        <h6>Aggingi sezione</h6>
          

          <div  className="transpose-button-container">
                <Button color="primary" variant="flat" type="button" id="Canzone"  onClick={AddSection}>Canzone</Button>
                <Button color="primary" variant="flat" type="button" id="Predica"  onClick={AddSection}>Predica</Button>
                <Button color="primary" variant="flat" type="button" id="Generico"  onClick={AddSection}>Generico</Button>
                <Button color="primary" variant="flat" type="button" id="Titolo"  onClick={AddSection}>Titolo</Button>

            </div>
            
            {   
                state.map((element,index) =>{
                    if(element.isTitle){
                      return (
                        <div key={element.key} className='flex flex-col gap-1.5 bg-slate-300 rounded-2xl p-4'>
                            <p className="flex flex-row justify-between justify-items-center">
                          <strong>{element.id}</strong>
                          <Button size="sm"
                          className="float-right"
                          isIconOnly type='button'
                          color="danger"
                          variant="bordered"
                          id={element.key}
                          onClick={removeSection}
                          >
                              <Image 
                              src="/images/utils/close-button.png" className="overflow-visible" alt=""/>
                          </Button>
                        </p>

                            <div className="container-input-2col flex gap-1.5">
                            <Input  
                            {...register(`sections.${index}.sectionId`)}
                            
                            name={"type"+element.key} 
                            key={index}  value={element.id} className='hide-input' />
                                        
                                        
                            </div> 
                                    
                                    <Textarea
                                    size="sm"
                                    
                                    {...register(`sections.${index}.description`)}
                                    onChange={editDescription}
                                    id={element.key}
                                    label="Descrizione"
                                    labelPlacement="inside"
                                    placeholder="Inserisci informazioni utili..."
                                  />
                    </div>)
                    }else{
                      return (
                        <div key={element.key} className='flex flex-col gap-1.5 bg-slate-200 rounded-2xl p-4'>
                            <p className="flex flex-row justify-between justify-items-center">
                              <strong>{element.id}</strong>
                              <Button size="sm"
                              className="float-right"
                              isIconOnly type='button'
                              color="danger"
                              variant="bordered"
                              id={element.key}
                              onClick={removeSection}
                              >
                                  <Image 
                                  className="overflow-visible text-gray-400"
                                  src="/images/utils/close-button.png" alt=""/>
                              </Button>
                            </p>
    
                            <div className="container-input-2col flex gap-1.5">

                            <Input  
                            {...register(`sections.${index}.sectionId`)}
                            name={"type"+element.key} key={element.key} value={element.id} className='hide-input' />
                             

                                        <Select
                                        size="sm"
                                        {...register(`sections.${index}.duration`)}
                                          label="Durata sezione"
                                          placeholder="10min..."
                                        >
                                          {durata.map((tempo:string ,index) => (
                                                
                                                <SelectItem key={index} value={tempo}>
                                                    {tempo}
                                                </SelectItem>
                                                ))}
                                        </Select>
                                        
                            </div> 
                                    {element.isSong && (
                                      <Autocomplete 
                                            size="sm"
                                            fullWidth={true}
                                            label="Seleziona la canzone" 
                                            className="max-w-lg"
                                            {...register(`sections.${index}.song`)}
                                        >
                                            {newSongList.map((song: Tsong) => (
                                                
                                            <AutocompleteItem key={song.id} value={song.song_title}>
                                                {song.song_title}
                                            </AutocompleteItem>
                                            ))}
                                        </Autocomplete>
                                        
    
                                    )}
                                    <Textarea
                                          {...register(`sections.${index}.description`)}
                                          label="Descrizione"
                                          onChange={editDescription}
                                          id={element.key}
                                          size="sm"
                                          labelPlacement="inside"
                                          placeholder="Inserisci informazioni utili..."
                                        />
                    </div>)
                    }
                    
                })
            }

          

          

          <br/><br/>
          <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
          Add Song
          </Button>
        </div>
      </form>
      </div>


      <div className="schedule-presentation bg-slate-100 ">
      
      <h4 className="border-b border-black">
      {!eventIsOther && tipoEvento[eventDetails.type]}
      {eventIsOther && eventDetails.title}
      </h4>
      <p className="mb-6">{eventDetails.date}</p>
      
      {state.map((element) => {
        if(element.id === "Titolo"){
          return (<div key={element.key} className="event-section-titolo"><p>{element.description}</p><small></small></div>);
        }
        return <p key={element.key}>{element.id}</p>;
      })}




      </div>
      </div>

</>);
}