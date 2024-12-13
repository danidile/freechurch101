// @ts-nocheck

"use client";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import {
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useForm } from "react-hook-form";
import { useState } from "react";

import Divider from "@mui/joy/Divider";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

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
  setlist: {
    id: string;
    song_title: string;
    author: string;
    key: string;
  };
};
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

export default function SundayPlanForm({
  songsList,
}: {
  songsList: TsongNameAuthor[];
}) {
  const newSongList = songsList;

  const teamMembers = [
    {
      id: "0",
      label: "Daniele Di Lecce",
      role: "Voce, Chitarra AC, Chitarra EL",
    },
    {
      id: "1",
      label: "Andrea Scircoli",
      role: "Voce, Chitarra AC, Mixerista",
    },
    {
      id: "2",
      label: "Daniel Oliveira",
      role: "Voce, Chitarra AC, Batteria",
    },
    {
      id: "3",
      label: "Israel Moraes",
      role: "Voce, Chitarra, Batteria",
    },
    {
      id: "4",
      label: "Gaia Ruscitto",
      role: "Voce",
    },
    {
      id: "5",
      label: "Sarah Frasson ",
      role: "Voce",
    },
    {
      id: "6",
      label: "Luca Gravellona",
      role: "Basso",
    },
    {
      id: "7",
      label: "Lia Rodriguez",
      role: "Voce",
    },
    {
      id: "8",
      label: "Martina Scircoli",
      role: "Voce",
    },
    {
      id: "9",
      label: "Giovanni",
      role: "Voce, Piano",
    },
    {
      id: "10",
      label: "Roger Flores",
      role: "Voce",
    },
    {
      id: "11",
      label: "Rhuan Ferreira",
      role: "Basso, Chitarra, Cajon",
    },
  ];
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
    setlist: {
      songId: "0",
      key: "G",
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
      test: "1",
      church: "0033",
      teamMembers: {
        memberId: "1",
        label: "Daniele Di Lecce",
        role: "Cantante, Chitarrista",
      },
      setlist: {
        id: "1",
        song_title: "Daniele Di Lecce",
        author: "Cantante, Chitarrista",
        key: "Cantante, Chitarrista",
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
    const completeForm = watchAllFields;
    console.log(completeForm);

    // addSetlist(watchAllFields);
  };

  // this section handles the worship modal
  const modalWorshipTeam = useDisclosure();
  const modalSetList = useDisclosure();

  // END OF this section handles the worship modal
  const [setList, setSetList] = useState([]);
  const addSongToSetList = (e) => {
    console.log(e.target);
    const song = newSongList.find((element) => element.id == e.target.id);
    setSetList([...setList, song]);
    console.log(setList);
  };
  const removeSongFromSetList = (e) => {
    console.log(e.target);

    const result = setList.filter((song) => song.id != e.target.id);
    setSetList(result);
    console.log(setList);
  };
  //change song Key in setlist
  const changeSongKey = (event) => {
    console.log(event);
  };

  return (
    <>
      <form onSubmit={handleSubmit(convertData)}>
        <h4 className="text-center">Pianifica Evento</h4>
        <div className="event-sections-body">
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <h6 className="center-x">Organizza Evento</h6>

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
            </div>
            <div className=" bg-gray-100 rounded-lg p-5">
              <p className="center-x p-3">
                <b>Worship Team</b>
              </p>
              <>
                <Modal
                  backdrop="opaque"
                  size="lg"
                  isOpen={modalWorshipTeam.isOpen}
                  onClose={modalWorshipTeam.onClose}
                  scrollBehavior="inside"
                >
                  <ModalContent className="planner-modal">
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          WorshipTeam
                        </ModalHeader>
                        <ModalBody>
                          <Select
                            {...register(`test`)}
                            label="Worship Team"
                            variant="flat"
                            className=" py-2"
                            size="sm"
                            selectionMode="multiple"
                            placeholder="Seleziona membro del Worship team"
                          >
                            {teamMembers.map((animal) => (
                              <SelectItem
                                key={animal.id}
                                title={animal.label}
                                description={animal.role}
                              ></SelectItem>
                            ))}
                          </Select>
                          {watch("test")
                            .split(",")
                            .map((element, index) => {
                              if (element) {
                                return (
                                  <div
                                    className="team-details-input"
                                    key={element.id}
                                  >
                                    <Input
                                      {...register(`teamMembers.${index}.id`)}
                                      value={element.id}
                                      className="hidden-input"
                                    ></Input>
                                    <p>{teamMembers[Number(element)].label}</p>{" "}
                                    <Select
                                      {...register(`teamMembers.${index}.key`)}
                                      label="Strumento"
                                      defaultSelectedKeys="0"
                                      variant="flat"
                                      size="sm"
                                    >
                                      {teamMembers[Number(element)].role
                                        .split(",")
                                        .map((animal, index) => (
                                          <SelectItem
                                            key={index}
                                            title={animal}
                                          ></SelectItem>
                                        ))}
                                    </Select>
                                  </div>
                                );
                              }
                            })}
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </>
              {watch("test")
                .split(",")
                .map((element) => {
                  if (element) {
                    return (
                      <>
                        <div className="team-details-input" key={element.id}>
                          <p>{teamMembers[Number(element)].label}</p>{" "}
                          {teamMembers[Number(element)].role.split(",")[0]}
                        </div>
                        <Divider></Divider>
                      </>
                    );
                  }
                })}
              <div className="float-right pt-6">
                <Button
                  onPress={modalWorshipTeam.onOpen}
                  isIconOnly
                  color="primary"
                  variant="flat"
                  size="lg"
                >
                  {/* Aggiungi Membri */}
                  <GroupAddIcon />
                </Button>
              </div>
            </div>
            <div className=" bg-gray-100 rounded-lg p-5">
              <p className="center-x pt-5">
                <b>Scegli Canzoni</b>
              </p>
              <>
                <Modal
                  backdrop="opaque"
                  size="lg"
                  isOpen={modalSetList.isOpen}
                  onClose={modalSetList.onClose}
                  scrollBehavior="inside"
                >
                  <ModalContent className="planner-modal">
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Log in
                        </ModalHeader>
                        <ModalBody>
                          <div>
                            <Input
                              label="Cerca Canzoni"
                              placeholder="La tua gloria...."
                              labelPlacement="outside"
                              className="pb-6"
                            />

                            {newSongList.map((song: Tsong, index) => {
                              return (
                                <p className="song-list-setlist">
                                  {song.song_title}
                                  <Button
                                    isIconOnly
                                    color="primary"
                                    size="sm"
                                    variant="bordered"
                                    id={song.id}
                                    onPress={addSongToSetList}
                                  >
                                    <PlaylistAddIcon id={song.id} />
                                  </Button>
                                </p>
                              );
                            })}
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </>
              {setList.map((song: Tsong, index) => {
                return (
                  <p className="song-list-setlist">
                    {song.song_title}
                    <Select
                      className="key-selector"
                      size="sm"
                      name="rrr"
                      id={setList.id}
                      name={setList.id}
                      items={keys}
                      placeholder="A"
                      color="primary"
                      aria-label="tonalità"
                      onChange={changeSongKey}
                    >
                      {(key) => (
                        <SelectItem id={setList.id} key={setList.id}>
                          {key.key}
                        </SelectItem>
                      )}
                    </Select>

                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      variant="bordered"
                      id={song.id}
                      onPress={removeSongFromSetList}
                    >
                      <PlaylistRemoveIcon />
                    </Button>
                  </p>
                );
              })}
              <div className="flex justify-end  pt-6">
                <Button
                  onPress={modalSetList.onOpen}
                  isIconOnly
                  color="primary"
                  variant="flat"
                  size="lg"
                  className="mr-0"
                >
                  <LibraryMusicIcon />
                </Button>
              </div>
            </div>
          </div>
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
      </form>
    </>
  );
}
