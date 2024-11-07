"use client"; 
import { eventSchema } from "@/utils/types/types";
import {Button} from "@nextui-org/react";
import { Input } from '@nextui-org/input';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { Select, SelectItem, Textarea} from "@nextui-org/react";
import { addSetlist } from "./addSetlistAction";
// import {addEvent} from './addEventAction';
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForever';
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import ArticleIcon from '@mui/icons-material/Article';
interface Tsections {
  id: string;
  key: string;
  isSong: boolean;
  isTitle: boolean;
  titleText?: string
  description?: string;
  duration?: string;
  songId?: string;
}
interface TeventBasics {
  type: string;
  title: string;
  date: string;
}

interface Tsong {
  id: string;
  song_title: string;
  author: string;
}
interface TsongNameAuthor {
  id: string;
  author: string;
  song_title: string;
}

type formValues ={
  eventType: string;
  church: string;
  eventTitle: string;
  date: string;
  sections: {  
              sectionType: string;
              duration: string;
              description: string;
              song: string;
            }[]
                      
}

export default function CreateSetlistForm({songsList}: {songsList : TsongNameAuthor[]}) {
    const newSongList = songsList;
    const [state, setState] = useState <Tsections[]>([]);
    const [eventDetails, setEventDetails] = useState<TeventBasics>({type: '0', title: "Culto domenicale", date: ""});
    const [eventIsOther, setEventIsOther] = useState(false);
    let x: string;
    const tipoEvento = ["Life Celebration","Riunione di Preghiera","Studio biblico","Youth Group","Concerto","Altro..."];
    const AddSection = (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget as HTMLInputElement 
      if(target){

      x = JSON.stringify(Math.floor((Math.random() * 10000000) + 1));
        const id = target.id;
        if(target.id === "Canzone"){
          setState((section) => [
            ...section,
            {id: id, key: x ,isSong: true, isTitle: false, duration: "10min"}
            
          ]);
        
        }else{
          setState((section) => [
            ...section,
            {id: id, key: x , isSong: false, isTitle: false, duration: "10min"}
            
          ]);
        }
        }
    };

    const {
      handleSubmit,
      setValue,
      register, watch,
      formState: { isSubmitting },
    } = useForm<formValues>({
      resolver: zodResolver(eventSchema),
        });
 const watchAllFields = watch(); // when pass nothing as argument, you are watching everything

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
      setValue("eventType", event.target.value);
      setValue("eventTitle", tipoEvento[Number(event.target.value)]);
    }
    const editTitle =(event: React.ChangeEvent<HTMLInputElement>)=>{
      const target = event.currentTarget as HTMLInputElement 
      setValue("eventTitle", target.value);

      setEventDetails({ ...eventDetails, title: target.value });
    }


  const convertData = async () =>{
    console.log(watchAllFields);  
    addSetlist(watchAllFields);
}

return (<>

{/* <Script  type="text/javascript" src='/snippets/accordian.js' /> */}

    <div className=" flex flex-row rounded-xl gap-3 ">
    <div className="form-div crea-setlist-container">
    <form onSubmit={handleSubmit(convertData)} >
        <h4>Crea Setlist</h4>
        
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <div className="gap-1.5">

        <Select
        {...register('eventType')}
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
          {...register('eventTitle')}

        type="text"
        label="Aggiungi Titolo evento"
        variant="bordered"
        size="sm"
        onChange={editTitle}
        />)}

        
        </div>
       <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
       <Input
            type="date"
            {...register('date')}
            label="Event Date"
            variant="bordered"
            size="sm"            
        />

        </div>
       
        <h6 className="mt-6">Aggingi sezione</h6>
          

          <div  className="transpose-button-container">
                <Button color="primary" variant="flat" type="button" id="Canzone"  onClick={AddSection}>Canzone</Button>
                <Button color="primary" variant="flat" type="button" id="Appunti"  onClick={AddSection}>Appunti</Button>

          </div>
            <div >
            <Accordion selectionBehavior="replace" isCompact={true} selectionMode="single" variant="light" className="gap-4" keepContentMounted={true}>

            {   
                state.map((element,index) =>{
                    
                      return (
                        <AccordionItem 
                        className="accordian-setlist"
                        startContent={<ArticleIcon/>}
                        key={element.key} aria-label="Accordion 1" title={element.id}
                        >

                            <Input  
                            name={"type"+element.key} key={element.key} value={element.id} className='hide-input' />

                            
                                        
                            {element.isSong && (
                                <Autocomplete 
                                    {...register(`sections.${index}.song`)}
                                    size="sm"
                                    fullWidth={true}
                                    label="Seleziona la canzone" 
                                    className="max-w-lg"
                                    disableAnimation={false}
                                    
                                >
                                    {newSongList.map((song: Tsong) => {
                                        return (
                                        
                                    <AutocompleteItem key={song.id} title={song.song_title} description={song.author} textValue={song.id}>

                                    
                                    </AutocompleteItem>
                                    )})}
                                </Autocomplete>                              
                            )}
                            <Textarea
                                    {...register(`sections.${index}.description`)}
                                    className="my-2"
                                    label="Descrizione"
                                    
                                    id={element.key}
                                    size="sm"
                                    labelPlacement="inside"
                                    placeholder="Inserisci informazioni utili..."

                                />
                            <Button size="sm"
                              className=" my-2"
                              isIconOnly type='button'
                              variant="bordered"
                              id={element.key}
                              onClick={removeSection}
                              accessKey={String(index)}
                            >
                                <DeleteForeverOutlinedIcon/>
                            </Button>   
                            </AccordionItem>

                            )
                })
            }
            </Accordion>

            </div>

          <br/>
          <Button color="primary" variant="shadow" type='submit' disabled={isSubmitting}>
          Add Song
          </Button>
        </div>
      </form>
      </div>
      </div>

</>);
}