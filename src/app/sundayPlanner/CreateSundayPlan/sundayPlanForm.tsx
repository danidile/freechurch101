"use client";
import { Autocomplete, AutocompleteItem, Select, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
// import {addEvent} from './addEventAction';
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForever";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import ArticleIcon from "@mui/icons-material/Article";
interface Tsections {
  id: string;
  key: string;
  isSong: boolean;
  isTitle: boolean;
  titleText?: string;
  description?: string;
  duration?: string;
  songId?: string;
}

type formValues = {
  eventType: string;
  eventTitle: string;
  date: string;
  church: string;
  test: string;
  teamMembers: {
    memberId: string;
    label: string;
    role: string;
  };
};
interface TsongNameAuthor {
  id: string;
  author: string;
  song_title: string;
}

export default function SundayPlanForm({songsList}: {songsList : TsongNameAuthor[]}) {
  const newSongList = songsList;

  const teamMembers = [
    {
      id: "1",
      label: "Daniele Di Lecce",
      role: "Cantante, Chitarrista",
    },
    {
      id: "2",
      label: "Andrea Scircoli",
      role: "Cantante, Chitarrista, Mixerista",
    },
    {
      id: "3",
      label: "Daniel Oliveira",
      role: "Cantante, Chitarrista, Mixerista",
    },
    {
      id: "4",
      label: "Israel Moraes",
      role: "Cantante, Chitarrista, Mixerista",
    },
    {
      id: "5",
      label: "Gaia Ruscitto",
      role: "Cantante, Chitarrista, Mixerista",
    },
    {
      id: "6",
      label: "Sarah Frasson ",
      role: "Cantante, Chitarrista, Mixerista",
    },
    {
      id: "7",
      label: "Luca Gravellona",
      role: "Cantante, Chitarrista, Mixerista",
    },
    {
      id: "8",
      label: "Lia Rodriguez",
      role: "Cantante, Chitarrista, Mixerista",
    },
    {
      id: "9",
      label: "Martina Scircoli",
      role: "Cantante, Chitarrista, Mixerista",
    },
    {
      id: "10",
      label: "Giovanni",
      role: "Cantante, Chitarrista, Mixerista",
    },
    {
      id: "11",
      label: "Roger Flores",
      role: "Cantante, Chitarrista, Mixerista",
    },
    {
      id: "12",
      label: "Rhuan Ferreira",
      role: "Bassista, Chitarrista",
    },
  ];
  const [state, setState] = useState<Tsections[]>([]);
  const [eventDetails, setEventDetails] = useState<formValues>({
    eventType: "0",
    eventTitle: "Culto domenicale",
    date: "",
    church: "0033",
    test: "",
    teamMembers: {
      memberId: "1",
      label: "Daniele Di Lecce",
      role: "Cantante, Chitarrista",
    },
  });
  const [eventIsOther, setEventIsOther] = useState(false);
  let x: string;
  const tipoEvento = [
    "Life Celebration",
    "Riunione di Preghiera",
    "Studio biblico",
    "Youth Group",
    "Concerto",
    "Altro...",
  ];
  const AddSection = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.currentTarget as HTMLInputElement;
    if (target) {
      x = JSON.stringify(Math.floor(Math.random() * 10000000 + 1));
      const id = target.id;
      if (target.id === "Canzone") {
        setState((section) => [
          ...section,
          { id: id, key: x, isSong: true, isTitle: false, duration: "10min" },
        ]);
      } else {
        setState((section) => [
          ...section,
          { id: id, key: x, isSong: false, isTitle: false, duration: "10min" },
        ]);
      }
    }
  };

  const {
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { isSubmitting },
  } = useForm<formValues>({
    defaultValues: {
      eventType: "0",
      eventTitle: "Culto domenicale",
      date: "",
      church: "0033",
      teamMembers: {
        memberId: "1",
        label: "Daniele Di Lecce",
        role: "Cantante, Chitarrista",
      },
    },
  });
  const watchAllFields = watch(); // when pass nothing as argument, you are watching everything

  // section => section[1] === event.target.id)
  const removeSection = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.currentTarget as HTMLInputElement;
    if (target) {
      setState(state.filter((section) => section.key != target.id));
    }
  };
  const istypeother = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);

    setEventDetails({ ...eventDetails, eventType: event.target.value });
    if (event.target.value == "5") {
      setEventIsOther(true);
    } else {
      setEventIsOther(false);
    }
    setValue("eventType", event.target.value);
    setValue("eventTitle", tipoEvento[Number(event.target.value)]);
  };
  const editTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget as HTMLInputElement;
    setValue("eventTitle", target.value);

    setEventDetails({ ...eventDetails, eventTitle: target.value });
  };

  const convertData = async () => {
    // watchAllFields.sections.map((section, index) => {
    //   const ref = watchAllFields.sections[index].song.split("#");
    //   newSongList.map((song, index) => {
    //     if (index === Number(ref[1])) {
    //       section.song = song.id;
    //     }
    //   });
    // });
    console.log(watchAllFields);

    // addSetlist(watchAllFields);
  };

  return (
    <>
          <form onSubmit={handleSubmit(convertData)}>
            <h4>Pianifica Evento</h4>
              <div className="event-info-header">
                <Select
                  {...register(`eventType`)}
                  label="Tipo di evento"
                  variant="flat"
                  size="sm"
                  placeholder="Riunione dei Giovani..."
                  onChange={istypeother}
                >
                  {tipoEvento.map((evento: string, index) => (
                    <SelectItem key={index} value={evento}>
                      {evento}
                    </SelectItem>
                  ))}
                </Select>
                {eventIsOther && (
                  <Input
                    {...register(`eventTitle`)}
                    type="text"
                    label="Aggiungi Titolo evento"
                    variant="flat"
                    size="sm"
                    onChange={editTitle}
                  />
                )}

                <Input
                  type="date"
                  {...register(`date`)}
                  label="Event Date"
                  variant="flat"
                  size="sm"
                />

                <Select
                  {...register(`test`)}
                  label="Favorite Animal"
                  variant="flat"
                  size="sm"
                  selectionMode="multiple"
                  placeholder="Select an animal"
                >
                  {teamMembers.map((animal) => (
                    <SelectItem key={animal.id}>{animal.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <br />
              <Button
                color="primary"
                variant="shadow"
                type="submit"
                disabled={isSubmitting}
              >
                Crea Evento
              </Button>



              <div className="event-info-header">
        
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <h4>Crea Setlist</h4>

        <h6>Aggingi sezione</h6>
          

          <div  className="transpose-button-container">
                <Button variant="flat" type="button" id="Canzone"  onClick={AddSection}>Canzone</Button>
                <Button variant="flat" type="button" id="Appunti"  onClick={AddSection}>Appunti</Button>
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
                                    size="sm"
                                    fullWidth={true}
                                    label="Seleziona la canzone" 
                                    className="max-w-lg autocomplete-mobile-input"
                                    disableAnimation={false}
                                    
                                >
                                    {newSongList.map((song: Tsong, index) => {
                                      
                                        return (
                                        
                                    <AutocompleteItem key={song.id} title={song.song_title} description={song.author} textValue={song.song_title + " " + song.author + " #" + index }>

                                    
                                    </AutocompleteItem>
                                    )})}
                                </Autocomplete>                              
                            )}
                            <Textarea
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
              </div>
          </form>
    </>
  );
}
