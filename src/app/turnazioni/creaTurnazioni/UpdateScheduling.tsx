"use client";
import { eventSchema } from "@/utils/types/types";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Autocomplete,
  AutocompleteItem,
  DropdownItem,
  Select,
  SelectItem,
  Input,
  CardFooter,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
// import {addEvent} from './addEventAction';
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
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
interface TeventBasics {
  type: string;
  title: string;
  date: string;
}

type formValues = {
  eventType: string;
  church: string;
  eventTitle: string;
  date: string;
  worshipTeam: {
    id: string;
    name: string;
  }[];
};

export default function UpdateScheduling() {
  const teamMembers = [
    {
      id: "1",
      name: "Daniele Di Lecce",
      role: "Cantante, Chitarrista",
    },
    {
      id: "2",
      name: "Andrea Scircoli",
      role: "Cantante, Chitarrista, Mixerista",
    },
    {
      id: "3",
      name: "Rhuan Ferreira",
      role: "Bassista, Chitarrista",
    },
  ];
  const strumenti = [
    {
      id: "1",
      name: "Voce",
    },
    {
      id: "2",
      name: "Chitarra",
    },
    {
      id: "3",
      name: "Basso",
    },
  ];
  const [worshipState, setWorshipState] = useState({
    active: false,
  });
  const [productionState, setProductionState] = useState({
    active: false,
  });
  const [state, setState] = useState<Tsections[]>([]);
  const [eventDetails, setEventDetails] = useState<TeventBasics>({
    type: "0",
    title: "Culto domenicale",
    date: "",
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

      setState((section) => [
        ...section,
        { id: id, key: x, isSong: true, isTitle: false, duration: "10min" },
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

    setEventDetails({ ...eventDetails, title: target.value });
  };

  const convertData = async () => {
    const data = watchAllFields;
    // const index = teamMembers.findIndex(member => member.name === watchAllFields.worshipTeam);
    watchAllFields.worshipTeam.map((member, index) => {
      let key = watchAllFields.worshipTeam.findIndex(
        (member) => member.id === watchAllFields.worshipTeam[index].id
      );
    });
    // watchAllFields.sections.map((section,index)=>{
    //   const ref = watchAllFields.sections[index].song.split('#');
    //   newSongList.map((song,index)=>{
    //     if(index === Number(ref[1])){
    //       section.song = song.id;
    //     }
    //   });

    // });
    console.log(watchAllFields);

    // addSetlist(watchAllFields);
  };

  const AddSectionComponent = (key: React.Key) => {
    console.log(key);
    if (key === "Worship") {
      setWorshipState({ active: true });
    }
    if (key === "Production") {
      setProductionState({ active: true });
    }
    console.log(worshipState.active);
  };

  return (
    <>
      {/* <Script  type="text/javascript" src='/snippets/accordian.js' /> */}
      <div className="container-sub">
        <div className="form-div crea-setlist-container">
          <form onSubmit={handleSubmit(convertData)}>
            <h4>Crea Turnazioni Evento</h4>

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
                    className="my-3"
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
                />
              </div>

              <h6 className="mt-6">Aggingi sezione</h6>

              <div className="transpose-button-container">
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered">Crea Sezione</Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Dynamic Actions"
                    onAction={AddSectionComponent}
                  >
                    <DropdownItem key="Worship">Worship Team</DropdownItem>
                    <DropdownItem key="Production">
                      Production Team
                    </DropdownItem>

                    <DropdownItem key="Welcome">Welcome Team</DropdownItem>
                    <DropdownItem key="Coffee">Coffee Team</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div>
                {worshipState.active && (
                  <Card className="my-4">
                    <CardBody className="flex-col gap-2">
                      <h6>Worship Team </h6>

                      {state.map((element, index) => {
                        return (
                          <div className="flex gap-4" key={"div" + index}>
                            <Input
                              name={"type" + element.key}
                              key={element.key}
                              value={element.id}
                              className="hide-input"
                            />

                            <Autocomplete
                              defaultItems={teamMembers}
                              size="sm"
                              label="Seleziona Musicista"
                              onSelectionChange={(key) => {
                                const selectedMember = teamMembers.find(
                                  (member) => member.id === key
                                );
                                if (selectedMember) {
                                  setValue(
                                    `worshipTeam.${index}.id`,
                                    selectedMember.id
                                  ); // Store ID
                                  setValue(
                                    `worshipTeam.${index}.name`,
                                    selectedMember.name
                                  ); // Store Name (optional)
                                }
                              }}
                              className="autocomplete-mobile-input"
                              disableAnimation={false}
                            >
                              {(member) => (
                                <AutocompleteItem
                                  key={member.id}
                                  id={member.id} // Use ID for tracking
                                  title={member.name}
                                />
                              )}
                            </Autocomplete>

                            <Button
                              size="sm"
                              className=" my-2"
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
                        );
                      })}
                    </CardBody>
                    <CardFooter>
                      <Button
                        color="primary"
                        variant="flat"
                        type="button"
                        className="mr-0"
                        id="Canzone"
                        onClick={AddSection}
                        isIconOnly
                      >
                        <AddIcon />
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
              <Button
                color="primary"
                variant="shadow"
                type="submit"
                disabled={isSubmitting}
              >
                Crea Turnazione
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
