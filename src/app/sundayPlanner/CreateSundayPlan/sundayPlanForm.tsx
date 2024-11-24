"use client";
import {Select, SelectItem} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
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


export default function SundayPlanForm() {
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
    }
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
    defaultValues:{
      eventType: "0",
      eventTitle: "Culto domenicale",
      date: "",
      church: "0033",
      teamMembers: {
        memberId: "1",
        label: "Daniele Di Lecce",
        role: "Cantante, Chitarrista",
      }
    }
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
      <div className=" flex flex-row rounded-xl gap-3 ">
        <div className="form-div crea-setlist-container">
          <form onSubmit={handleSubmit(convertData)}>
            <h4>Crea Setlist</h4>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <div className="transpose-button-container">
                <Button
                  color="primary"
                  variant="flat"
                  type="button"
                  id="Canzone"
                  onClick={AddSection}
                >
                  Aggiungi evento
                </Button>
                
              </div>
              <div>
                <Accordion
                  selectionBehavior="replace"
                  isCompact={true}
                  selectionMode="single"
                  variant="light"
                  className="gap-4"
                  keepContentMounted={true}
                >
                  {state.map((element, index) => {
                    return (
                      <AccordionItem
                        className="accordian-setlist"
                        startContent={<ArticleIcon />}
                        key={element.key}
                        aria-label="Accordion 1"
                        title="Evento"
                      >
                        <div className="accordian-container">
                          <Select
                            {...register(`eventType`)}
                            label="Tipo di evento"
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
                              variant="bordered"
                              size="sm"
                              onChange={editTitle}
                            />
                          )}

                          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                            <Input
                              type="date"
                              {...register(`date`)}
                              label="Event Date"
                              variant="bordered"
                              size="sm"
                            />
                          </div>
                          <Input
                            name={"type" + element.key}
                            key={element.key}
                            value={element.id}
                            className="hide-input"
                          />
                            <Select
                              {...register(`test`)}
                              label="Favorite Animal"
                              selectionMode="multiple"
                              placeholder="Select an animal"
                            >
                              {teamMembers.map((animal) => (
                                <SelectItem key={animal.id}>
                                  {animal.label}
                                </SelectItem>
                              ))}
                            </Select>
                          <div className="right-">
                            <Button
                              size="sm"
                              isIconOnly
                              type="button"
                              variant="bordered"
                              id={element.key}
                              onClick={removeSection}
                              accessKey={String(index)}
                            >
                              <DeleteForeverOutlinedIcon />
                            </Button>
                          </div>
                        </div>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>

              <br />
              <Button
                color="primary"
                variant="shadow"
                type="submit"
                disabled={isSubmitting}
              >
                Salva modifiche
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
