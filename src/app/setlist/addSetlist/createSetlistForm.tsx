"use client";
import { eventSchema } from "@/utils/types/types";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Link,
} from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Select, SelectItem, Textarea } from "@nextui-org/react";
// import {addEvent} from './addEventAction';
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForever";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import ArticleIcon from "@mui/icons-material/Article";
import { addSetlist } from "./addSetlistAction";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import {
  Tsections,
  TeventBasics,
  TsongNameAuthor,
  Tsong,
  formValues,
} from "@/utils/types/types";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export default function CreateSetlistForm({
  songsList,
}: {
  songsList: TsongNameAuthor[];
}) {
  const keys = [
    { key: "A" },
    { key: "A#" },
    { key: "B" },
    { key: "C" },
    { key: "C#" },
    { key: "D" },
    { key: "D#" },
    { key: "E" },
    { key: "F" },
    { key: "F#" },
    { key: "G" },
    { key: "G#" },
  ];
  const newSongList = songsList;
  const [state, setState] = useState<Tsections[]>([]);
  const [eventDetails, setEventDetails] = useState<TeventBasics>({
    type: "0",
    title: "Culto domenicale",
    date: "2026-01-01",
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
      let randomN = Math.floor(Math.random() * 1000000);
      setState((section) => [
        ...section,
        {
          id: randomN,
          key: x,
          isSong: true,
          isTitle: false,
          duration: "10min",
          tonalita: "A",
        },
      ]);
    }
  };

  const {
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { isSubmitting },
  } = useForm<formValues>({
    resolver: zodResolver(eventSchema),
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
    setEventDetails({ ...eventDetails, type: event.target.value });
    if (event.target.value == "4") {
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

    setEventDetails({ ...eventDetails, title: target.value });
  };

  const convertData = async () => {
    watchAllFields.sections.map((section, index) => {
      console.log(section);

      const ref = watchAllFields.sections[index].song.split("#");
      newSongList.map((song, index) => {
        if (index === Number(ref[1])) {
          section.song = song.id;
        }
      });
    });
    console.log(watchAllFields);

    addSetlist(watchAllFields);
  };
  const dragControls = useDragControls();
  const y = useMotionValue(0);

  
  return (
    <div className="container-sub">
      <div className="form-div crea-setlist-container">
        <form onSubmit={handleSubmit(convertData)}>
          <h4>Crea Setlist</h4>

          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <div className="gap-1.5">
              <Select
                {...register("eventType")}
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
                  {...register("eventTitle")}
                  type="text"
                  label="Aggiungi Titolo evento"
                  variant="bordered"
                  size="sm"
                  onChange={editTitle}
                />
              )}
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Input
                type="date"
                {...register("date")}
                label="Event Date"
                variant="bordered"
                size="sm"
                defaultValue="2026-01-01"
              />
            </div>

            <h6 className="mt-6">Aggiungi sezione</h6>

            
            <Reorder.Group axis="y" values={state} onReorder={setState}>
              {state.map((section, index) => {
                return (
                  <Reorder.Item
                    value={section}
                    key={section.id}
                    >
                    <Card className="my-4">
                      <CardBody>
                        <Input
                          name={"type" + section.id}
                          key={section.id}
                          value={section.id.toString()}
                          className="hide-input"
                        />
                        <div className="song-details-selection1">
                          <Autocomplete
                            {...register(`sections.${index}.song`)}
                            label="Seleziona la canzone"
                            className="max-w-lg autocomplete-mobile-input ac-setlist"
                            disableAnimation={true}
                          >
                            {newSongList.map((song: Tsong, index) => {
                              return (
                                <AutocompleteItem
                                  key={song.id}
                                  title={song.song_title}
                                  description={song.author}
                                  textValue={
                                    song.song_title +
                                    " " +
                                    song.author +
                                    " #" +
                                    index
                                  }
                                ></AutocompleteItem>
                              );
                            })}
                          </Autocomplete>
                          <Select
                            {...register(`sections.${index}.tonalita`)}
                            className="key-selector"
                            size="lg"
                            items={keys}
                            placeholder="A"
                            aria-label="tonalità"
                          >
                            {(key) => (
                              <SelectItem id={key.key} key={key.key}>
                                {key.key}
                              </SelectItem>
                            )}
                          </Select>
                          <Button
                            size="sm"
                            className=" my-2"
                            isIconOnly
                            color="danger"
                            type="button"
                            variant="bordered"
                            id={section.key}
                            onClick={removeSection}
                            accessKey={String(index)}
                          >
                            <DeleteForeverOutlinedIcon />
                          </Button>
                          <Button
                            variant="light"
                            key={section.id}
                            onPointerDown={(event) => dragControls.start(event)}
                            isIconOnly
                          >
                            <DragIndicatorIcon key={section.id} />
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
            <div className="transpose-button-container">
              <Button
                color="primary"
                variant="flat"
                type="button"
                id="Canzone"
                onClick={AddSection}
              >
                Aggiungi Canzone
              </Button>
            </div>
            <br />
            <Button
              color="primary"
              variant="shadow"
              type="submit"
              disabled={isSubmitting}
            >
              Crea Setlist
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
